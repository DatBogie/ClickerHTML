// Building block classes
const keys = {"Control":false,"Space":false};
class vector2 {
    x=0;
    y=0;
    pos=[0,0];
    constructor(x=0,y=0) {
        this.x = x
        this.y = y
        this.pos = [x,y]
    };
    add(vector) {
        this.pos = [this.x+vector.x,this.y+vector.y];
        [this.x, this.y] = this.pos;
    };
    sub(vector) {
        this.pos = [this.x-vector.x,this.y-vector.y];
        [this.x, this.y] = this.pos;
    };
    mul(vector) {
        this.pos = [this.x*vector.x,this.y*vector.y];
        [this.x, this.y] = this.pos;
    };
    div(vector) {
        this.pos = [this.x/vector.x,this.y/vector.y];
        [this.x, this.y] = this.pos;
    };
    abs() {
        this.pos = [Math.abs(this.x),Math.abs(this.y)];
        [this.x, this.y] = this.pos;
    };
    neg() {
        this.pos = [-this.x,-this.y];
        [this.x, this.y] = this.pos;
    };
    dist() {
        return Math.abs(this.x-this.y)
    };
};
class elementData {
    tag="";
    units={
        "x":"",
        "y":"",
        "sx":"",
        "sy":""
    };
    id="";
    class="";
    style={};
    constructor(_tag="div",_units={"x":"","y":"","sx":"","sy":""},_id="",_class="",_style={}) {
        this.tag = _tag;
        this.id = _id;
        this.class = _class;
        this.style = _style;
    };
};
class obj {
    pos=new vector2;
    size=new vector2;
    elemData=new elementData;
    constructor(_pos=new vector2,_size=new vector2,_elemData=new elementData) {
        this.pos = _pos;
        this.size = _size;
        this.elemData = _elemData;
    };
    create(parent=document.body) {
        let el = document.createElement(this.elemData.tag);
        if (parent) {
            parent.appendChild(el);
        } else {
            document.body.appendChild(el);
        };
        el.id = this.elemData.id;
        el.className = this.elemData.class;
        for (const key in this.elemData.style) {
            if (Object.prototype.hasOwnProperty.call(this.elemData.style, key)) {
                const value = this.elemData.style[key];
                el.style[key] = value;
            };
        };
    };
};

// Object classes
class button {
    clickEvent=function(){};
    hoverEvent=function(){};
    leaveEvent=function(){};
    text="";
    _obj=new obj;
    constructor(__obj=new obj,_text="",_clickEvent=function(){console.log("Clicked!")},_hoverEvent=function(){console.log("Hover!")},_leaveEvent=function(){console.log("Hover left!")}) {
        this._obj = __obj;
        this._obj.elemData.tag = "button";
        this.text = _text
        this.clickEvent = _clickEvent;
        this.hoverEvent = _hoverEvent;
        this.leaveEvent = _leaveEvent;
    };
    create(parent=document.body) {
        this._obj.create(parent);
        let el = document.getElementById(this._obj.elemData.id);
        if (el) {
            el.id = this._obj.elemData.id
            el.className = this._obj.elemData.class
            el.innerHTML = this.text
            el.onclick = this.clickEvent;
            el.onmouseenter = this.hoverEvent;
            el.onmouseleave = this.leaveEvent;
            el.title = "Space";
        }
    };
};

document.getElementById("prompt").style.scale = 4;
document.getElementById("prI").value = "";

// Shop Items
class shopItem {
    name="";
    desc="";
    price=0;
    func=function(){};
    _obj=new button;
    id="";
    updateText(x="") {
        let el = document.getElementById(this.id);
        if (!el) {return};
        if (x != "") {
            el.innerHTML = x;
        } else {
            let t = this.name + " (" + this.price.toString() + "C)";
            el.innerHTML = t;
        };
    };
    constructor(_name="Shop Item",_desc="Shop Item",_price=0,_pmul=1.2,_bought=function(){CPS++},_id="",__obj=new button) {
        this.name = _name;
        this.desc = _desc;
        this.price = _price;
        this.owned=0;
        this._obj = __obj;
        this._obj.text = this.name
        this.pmul = _pmul
        this.bought = _bought
        this.func = () => {
            console.log(this.price);
            if (COOKIES >= this.price) {
                console.log(COOKIES-this.price);
                this.bought();
                updateCookies(COOKIES-this.price);
                this.owned++;
                this.price=Math.round(this.price*this.pmul);
                this.updateText();
            };
        };
        this._obj.clickEvent = this.func;
        if (_id && typeof(_id) == "string") {
            this.id = _id;
            this._obj._obj.elemData.id = _id;
        };
        let el = document.getElementById('shop');
        this._obj.create(el? el : document.body);
        let _el = document.getElementById(this.id);
        if (_el) {
            _el.title = this.desc;
        };
        this.updateText();
    };
};

const shopItems = [
    new shopItem("Auto Clicker Upgrade","Clicks Per Second +2",50,1.2,function(){CPS+=2},"cpc1"),
    new shopItem("Click Upgrade","Click Power +1",100,1.4,function(){CPC+=1},"cps1")
];

function openPrompt(title="Prompt",txt0="Confirm",txt1="Cancel",txti="",f0=closePrompt,f1=closePrompt) {
    let x = document.getElementById("prompt");
    if (x) {
        // Set Data
        let t = document.getElementById("prT");
        let i = document.getElementById("prI");
        let b0 = document.getElementById("pr0");
        let b1 = document.getElementById("pr1");
        t.innerHTML = title;
        if (txti.length > 0) {
            i.value = txti;
        };
        if (txt0.length > 0) {
            b0.style.display = "block";
            b0.innerHTML = txt0;
            b0.onclick = f0;
        } else {
            b0.style.display = "none";
        };
        if (txt1.length > 0) {
            b1.style.display = "block";
            b1.innerHTML = txt1;
            b1.onclick = f1;
        } else {
            b1.style.display = "none";
        };
        // Prep
        x.style.pointerEvents = "all";
        x.style.transition = 'all 0ms linear';
        x.style.scale = 0;
        x.style.opacity = 0;
        x.offsetWidth;
        // Open
        x.style.transition = 'all 200ms cubic-bezier(0,1,.2,1.25)';
        x.style.scale = 1;
        x.style.opacity = 1;
        // Finish
        x.offsetWidth;
        x.style.transition = 'all 200ms cubic-bezier(0,1,1,1)';
    };
}

function closePrompt() {
    let x = document.getElementById("prompt");
    if (x) {
        x.style.pointerEvents = "none"
        x.style.scale = 4;
        x.style.opacity = 0;
    };
};

const data = {};

// Generate Save Code
function getSaveCode() {
    let dataDict = {
        "COOKIES":COOKIES,
        "CPC":CPC,
        "CPS":CPS,
        "OwnedItems":{} // "ItemName":amtOwned
    };
    shopItems.forEach(item => {
        console.log(item.owned);
        dataDict.OwnedItems[item.name] = item.owned;
    });
    if (Object.keys(data).length > 0) {
        dataDict = Object.assign({},dataDict,data);
    };
    let result = JSON.stringify(dataDict);
    result = btoa(result);
    console.log(result);
    openPrompt("Save Code","Copy","Close",result,function(){
        document.getElementById("prI").select();
        document.getElementById("prI").setSelectionRange(0,result.length);
        navigator.clipboard.writeText(result);
    });
    // alert(result);
    return result;
};

// Load Save Code
function loadSaveCode() {
    // let code = prompt("Enter code");
    openPrompt(
        "Enter Save Code",
        "Load",
        "Cancel",
        "",
        function() {
            let code = document.getElementById("prI").value;
            console.log(code);
            document.getElementById("loading").style.display = "block"
            try {
                if (code && code.length > 0) {
                    let decode = atob(code);
                    let dataDict = JSON.parse(decode);
                    if (dataDict) {
                        COOKIES = dataDict["COOKIES"];
                        CPC = dataDict["CPC"];
                        CPS = dataDict["CPS"];
                        OwnedItems = dataDict["OwnedItems"];
                        shopItems.forEach(item => {
                            item.owned = OwnedItems[item.name];
                            if (item.owned > 0) {
                                item.price*=(item.pmul*item.owned);
                                item.updateText();
                            };
                        });
                        for (const key in dataDict) {
                            let value = dataDict[key];
                            if (key != "COOKIES" && key != "CPC" && key != "CPS" && key != "OwnedItems") {
                                data[key] = value;
                            };
                        };
                    };
                };
            } catch (error) {
                document.getElementById("loading").innerHTML = "Invalid Code!"
            };
            setTimeout(() => {
                document.getElementById("loading").style.display = "none";
                document.getElementById("loading").innerHTML = "Loading..."
            }, 1000);
            closePrompt();
        },

    );
    // if (code && code.length > 0) {
    //     let decode = atob(code);
    //     let dataDict = JSON.parse(decode);
    //     if (dataDict) {
    //         COOKIES = dataDict["COOKIES"];
    //         CPC = dataDict["CPC"];
    //         CPS = dataDict["CPS"];
    //         OwnedItems = dataDict["OwnedItems"];
    //         shopItems.forEach(item => {
    //             item.owned = OwnedItems[item.name];
    //             if (item.owned > 0) {
    //                 item.price*=(item.pmul*item.owned);
    //                 item.updateText();
    //             };
    //         });
    //         for (const key in dataDict) {
    //             let value = dataDict[key];
    //             if (key != "COOKIES" && key != "CPC" && key != "CPS" && key != "OwnedItems") {
    //                 data[key] = value;
    //             };
    //         };
    //     };
    // };

};

// Code
var COOKIES = 0;
var CPC = 1;
var CPS = 0;
function updateCookies(x=0) {
    let el = document.getElementById('tcookie');
    if (el && typeof(x) == "number") {
        COOKIES = x;
        el.innerHTML = "Cookies: " + COOKIES.toString() + "C";
    };
};
updateCookies()

function clickCookie() {
    updateCookies(COOKIES + CPC);
    let el = document.getElementById('cookie');
    if (el) {
        el.style.backgroundColor = "rgb(77, 50, 3)";
        el.style.scale = ".75";
        setTimeout(function() {
            if (el) {
                el.style.backgroundColor = "";
                el.style.scale = "1";
            }
        }, 100);
    };
};

const cookie = new button(
    new obj(
        new vector2(50,50),
        new vector2(50,50),
        new elementData(
            'div',
            {'x':'vw','y':'vh','sx':'vw','sy':'vw'},
            'cookie',
            'player'
        )
    ),
    "",
    clickCookie,
    function() {
        let el = document.getElementById('cookie');
        if (el) {
            el.style.width = "30vw";
            el.style.height = "30vw";
            el.style.left = "calc((50vw - 15vw) - 10vw)";
            el.style.top = "calc(50vh - 15vw)";
        };
    },
    function() {
        let el = document.getElementById('cookie');
        if (el) {
            el.style.width = "25vw";
            el.style.height = "25vw";
            el.style.left = "calc((50vw - 12.5vw) - 10vw)";
            el.style.top = "calc(50vh - 12.5vw)";
        };
    }
);

cookie.create();

setInterval(function() {
    updateCookies(COOKIES+CPS);
},1000);

window.addEventListener('keydown',function(key) {
    if (key.code == "ControlLeft" || key.code == "ControlRight") {
        keys["Control"] = true;
    };
    if (key.key == "s") {
        if (keys["Control"]) {
            key.preventDefault();
            getSaveCode();
        };
    };
    if (key.key == "l") {
        if (keys["Control"]) {
            key.preventDefault();
            loadSaveCode();
        };
    };
    if (key.key == "p") {
        if (keys["Control"]) {
            key.preventDefault();
            openPrompt();
        };
    };
    if (key.code == "Space") {
        let x = this.document.getElementById("prompt");
        if (x && x.style.scale <= 1) {
            return;
        };
        key.preventDefault();
        // key.preventDefault();
        if (keys["Space"] == false) {
            clickCookie()
            keys["Space"] = true;
        };
    };
    if (key.code == "Tab") {
        key.preventDefault();
    };
});

window.addEventListener('keyup',function(key) {
    if (key.code == "Space") {
        keys["Space"] = false;
    };
    if (key.code == "ControlLeft" || key.code == "ControlRight") {
        keys["Control"] = false;
    };
});
