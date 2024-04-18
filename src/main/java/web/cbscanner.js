let ws = new WebSocket("ws://localhost:4567/websocket/echo");

Quagga.init({
    inputStream : {
        name : "Live",
        type : "LiveStream",
        target: document.querySelector('#camera')    // Or '#yourElement' (optional)
    },
    decoder : {
        readers : ["ean_reader"] //code_128_reader
    }
}, function(err) {
    if (err) {
        console.log(err);
        return
    }
    console.log("Initialization finished. Ready to start");
    Quagga.start();
});



ws.onopen= function (event) {
    console.log(event);
    Quagga.onProcessed(function (result) {
        let drawingCtx = Quagga.canvas.ctx.overlay,
            drawingCanvas = Quagga.canvas.dom.overlay;

        if (result){
            if(result.boxes){
                drawingCtx.clearRect(0,0,parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
                result.boxes.filter(function (box){
                    return box!== result.box;
                }).forEach(function (box) {
                    Quagga.ImageDebug.drawPath(box, {
                        x:0,
                        y:1
                    }, drawingCtx,{
                        color: "green",
                        linewidth: 2

                    }) ;
                });



            }
            if(result.box){
                Quagga.ImageDebug.drawPath(result.box, {
                    x: 0,
                    y:1
                }, drawingCtx,{

                    color: "#00F",
                    lineWidth: 2
                });

            }
            if(result.codeResult && result.codeResult.code){
                console.log("73");
                Quagga.ImageDebug.drawPath(result.line, {
                    x:'x',
                    y:'y'


                }, drawingCtx, {
                    color:'red',
                    linewidth: 3
                });

            }

        }
    });


    Quagga.onDetected(function (data) {



        console.log(data);
        document.getElementById("code").innerHTML= `<p> Code : ${data.codeResult.code}</p>`
        //document.getElementById("resultat").innerHTML = `<p> ${data.codeResult.code}</p>`;



        ws.send(data.codeResult.code);


    });
}

ws.onclose = function (event) {
    console.log(event);
}

ws.onmessage=function (event) {
    console.log(event);



    if(event.data.indexOf("Nutriscore_grade : a")!=-1){
        document.getElementById("nutriscoreresult").innerHTML= `<div class="img_attr"> <img src="./img/nutriscoreA.jpg" style="height:72px;float:left;margin-left:0.5rem;" /> </div> <div class="attr_text">  <h4 class="grade_title_attr_title" style="color: green ">Nutriscore : A</h4><br> <p id="titre">Tres bonne qualité nutritionelle</p></br></div>`
    } else if(event.data.indexOf("Nutriscore_grade : b")!=-1){
        document.getElementById("nutriscoreresult").innerHTML= ` <div class="img_attr"><img src="./img/nutriscoreB.jpg" style="height:72px;float:left;margin-left:0.5rem;"/> </div> <div class="attr_text">  <h4 class="grade_title_attr_title" style="color: #60ac0e"> Nutriscore : B</h4></div><br> <p id="titre">Bonne qualité nutritionelle</p></br>`
    } else if (event.data.indexOf("Nutriscore_grade : c")!=-1){
        document.getElementById("nutriscoreresult").innerHTML= `<div class="img_attr"> <img src="./img/nutriscoreC.jpg" style="height:72px;float:left;margin-left:0.5rem;"/> </div> <div class="attr_text">  <h4 class="grade_title_attr_title" style="color: yellow "> Nutriscore : C</h4><br> <p id="titre"> Qualité nutritionelle modérée</p></br></div> `
    } else if(event.data.indexOf("Nutriscore_grade : d")!=-1){
        document.getElementById("nutriscoreresult").innerHTML= `<div class="img_attr"> <img src="./img/nutriscoreD.jpg" style="height:72px;float:left;margin-left:0.5rem;" /> </div> <div class="attr_text">  <h4 class="grade_title_attr_title" style="color:  orange "> Nutriscore : D</h4><br> <p id="titre"> Mauvaise qualité nutritionelle</p></br></div>`
    } else  if(event.data.indexOf("Nutriscore_grade : e")!=-1){
        document.getElementById("nutriscoreresult").innerHTML= `<div class="img_attr"> <img src="./img/nutriscoreE.jpg" style="height:72px;float:left;margin-left:0.5rem;"/> </div> <div class="attr_text">  <h4 class="grade_title_attr_title" style=" color: red "> Nutriscore : E</h4> <br> <p id="titre">Tres mauvaise qualité nutritionelle</p></br></div>`
    }else if (event.data.indexOf("Il faut scanner un code bar d'un produit alimentaire sinon bien scanner votre code si c'est un produit alimentaire")!=-1) {
        document.getElementById("nutriscoreresult").innerHTML=`<p> ${event.data}</p> <br> Si vous etes sur d'avoir bien scanné le CB de votre produit, cela veut dire que le produit n'a pas été trouvé dans notre base<br>`;


    } else {

        document.getElementById("nutriscoreresult").innerHTML=`<p> Ecoscore_grade : not-found</p>`;
    }
    if(event.data.indexOf("Il faut scanner un code bar d'un produit alimentaire sinon bien scanner votre code si c'est un produit alimentaire")!=0){
        if(event.data.indexOf("Ecoscore_grade : a")!=-1){
            document.getElementById("ecoscoreresult").innerHTML= `<div class="img_attr"> <img src="./img/ecoscoreA.svg" style="height:72px;float:left;margin-left:0.5rem;" /></div><div class="attr_text">  <h4 class="grade_title_attr_title" style=" color: green "> Ecoscore : A</h4> <br> <p id="titre">tres faible impact environnementale</p></br></div>`
        } else if(event.data.indexOf("Ecoscore_grade : b")!=-1){
            document.getElementById("ecoscoreresult").innerHTML= ` <div class="img_attr"> <img src="./img/ecoscoreB.svg" style="height:72px;float:left;margin-left:0.5rem;" /> </div> <div class="attr_text">  <h4 class="grade_title_attr_title" style=" color: #60ac0e"> Ecoscore : B</h4> <br> <p id="titre"> faible impact environnementale</p></br></div>`
        } else if (event.data.indexOf("Ecoscore_grade : c")!=-1){
            document.getElementById("ecoscoreresult").innerHTML= `<div class="img_attr"><img src="./img/ecoscoreC.svg" style="height:72px;float:left;margin-left:0.5rem;"  /> </div> <div class="attr_text">  <h4 class="grade_title_attr_title" style=" color: #C88F01 "> Ecoscore : C</h4> <br> <p id="titre"> impact modéré environnementale</p></br></div>`
        } else if(event.data.indexOf("Ecoscore_grade : d")!=-1){
            document.getElementById("ecoscoreresult").innerHTML= `<div class="img_attr"><img src="./img/ecoscoreD.svg" style="height:72px;float:left;margin-left:0.5rem;" /> </div> <div class="attr_text">  <h4 class="grade_title_attr_title" style=" color: orange "> Ecoscore : D</h4> <br> <p id="titre"> impact environnementale élevé</p></br></div>`
        } else  if(event.data.indexOf("Ecoscore_grade : e")!=-1){
            document.getElementById("ecoscoreresult").innerHTML= `<div class="img_attr"><img src="./img/ecoscoreE.svg" style="height:72px;float:left;margin-left:0.5rem;" /> </div> <div class="attr_text">  <h4 class="grade_title_attr_title" style=" color: red "> Ecoscore : E</h4> <br> <p id="titre">impact environnementale tres élevé</p></br></div>`
        } else {

            document.getElementById("ecoscoreresult").innerHTML=`<div class="img_attr"><img src="./img/ecoscore-not-applicable.svg" style="height:72px;float:left;margin-left:0.5rem;" /> </div> <div class="attr_text">  <h4 class="grade_title_attr_title" > not-applicable</h4> <br> <p id="titre">Eco-score non encore appliqué</p></br></div>`;
        }}else {
        document.getElementById("ecoscoreresult").innerHTML=`<p></p>`;

    }


}