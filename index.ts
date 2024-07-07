// Building block classes
const keys = {"Space":false};
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
        }
    };
};

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
    constructor(_name="Shop Item",_desc="Shop Item",_price=0,_func=function(){console.log("Shop Item Purchased!")},__obj=new button,_id="") {
        this.name = _name;
        this.desc = _desc;
        this.price = _price;
        this._obj = __obj;
        this._obj.text = this.name
        this.func = _func
        this._obj.clickEvent = this.func
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
    new shopItem("Auto Clicker Upgrade","Clicks Per Second +2",50,function(){if (COOKIES >= shopItems[0].price) {console.log(COOKIES-shopItems[0].price);CPS+=2;updateCookies(COOKIES-shopItems[0].price);shopItems[0].price=Math.round(shopItems[0].price*1.2);shopItems[0].updateText()}},new button,"cpc1"),
    new shopItem("Click Upgrade","Click Power +1",100,function(){if (COOKIES >= shopItems[1].price) {console.log(COOKIES-shopItems[1].price);CPC+=1;updateCookies(COOKIES-shopItems[1].price);shopItems[1].price=Math.round(shopItems[1].price*1.4);shopItems[1].updateText()}},new button,"cps1")
];

const data = {};

function getSaveCode() {
    let dataDict = {
        "COOKIES":COOKIES,
        "CPC":CPC,
        "CPS":CPS
    };
    if (Object.keys(data).length > 0) {
        dataDict = Object.assign({},dataDict,data);
    };
    let result = JSON.stringify(dataDict);
    result = btoa(result);
    console.log(result);
    alert(result);
    return result;
};

function loadSaveCode() {
    let code = prompt("Enter code");
    if (code && code.length > 0) {
        let decode = atob(code);
        let dataDict = JSON.parse(decode);
        if (dataDict) {
            COOKIES = dataDict["COOKIES"];
            CPC = dataDict["CPC"];
            CPS = dataDict["CPS"];
            for (const key in dataDict) {
                let value = dataDict[key];
                if (key != "COOKIES" && key != "CPC" && key != "CPS") {
                    data[key] = value
                };
            };
        };
    };
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
    if (key.key == "s") {
        getSaveCode();
    };
    if (key.key == "l") {
        loadSaveCode();
    };
    console.log(key)
    if (key.code == "Space") {
        if (keys["Space"] == false) {
            clickCookie()
            keys["Space"] = true;
        };
    };
    if (key.code == "Tab") {
        key.preventDefault()
    };
});

window.addEventListener('keyup',function(key) {
    if (key.code == "Space") {
        keys["Space"] = false;
    };
});