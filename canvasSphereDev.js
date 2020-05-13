function onload_func() {

let king = document.getElementById('king')
let container = document.getElementById( 'canvas' )
let ctx = container.getContext( "2d" )
let xcoord = 0
let ycoord = 0
let zcoord = 0
let buttonQuantity = 10   // количество надписей
let pointsQuantity = 100  // количество точек
let r = container.offsetWidth/2.1
let time = 0
let url = 'http://www.json-generator.com/api/json/get/bTKTKJjEeq?indent=2'
let points = []
let btn = []
let animate = true

fetchPoints()

function addButton (company ,link, i) {
  btn[i] = document.createElement("button")
  btn[i].setAttribute("onclick", `window.location.href = '${link}'`)
  let node = document.createTextNode(company)
  btn[i].appendChild(node)
  king.appendChild(btn[i])
}

async function fetchPoints() {
  const response = await fetch(url)
  const data = await response.json()
  gotData(data)
}

king.addEventListener('mouseover', function(e) { animate = false })

king.addEventListener('mouseout', function(e) { animate = true })

function gotData(data) {

  points = [...data]
  for (let i = 0; i < pointsQuantity; i++) {
    let theta = Math.floor(Math.random()*180)
    let phi = Math.floor(Math.random()*360)
    points[i] = {...points[i], theta: theta, phi: phi}
    if ( i < buttonQuantity ) addButton(points[i].company, points[i].link, i)
  }

  (function animation() {
    setTimeout(function() {
      ctx.clearRect( 0, 0, container.width, container.height );
      points.forEach( ({theta, phi}, i) => {
        xcoord=r*Math.sin( theta*Math.PI/180 )*Math.cos( ( phi+time )*Math.PI/180 )
        ycoord=r*Math.sin( theta*Math.PI/180 )*Math.sin( ( phi+time )*Math.PI/180 )
        zcoord=r*Math.cos( theta*Math.PI/180 )
        let z1=-xcoord*Math.sin( Math.PI/180 )+zcoord*Math.cos( Math.PI/180 )
        let newx=ycoord
        let newy=z1
        points[i].x = newx*Math.cos(.3*Math.PI/180)+newy*Math.sin( .3*Math.PI/180 )+container.offsetWidth/2
        points[i].y = -newx*Math.sin(.3*Math.PI/180)+newy*Math.cos( .3*Math.PI/180 )+container.offsetHeight/2
        if (i < buttonQuantity) {
          btn[i].style.marginLeft = `${points[i].x}px`
          btn[i].style.marginTop = `${points[i].y}px`
        }
        addCanvasPoint( points[i], ctx )
      })
      if (animate) time++ 
      animation() 
    }, 20);
  })();            
 }
}

function addCanvasPoint ( obj, context ) {
   context.strokeStyle = "rgba(0,0,0,1)";
   context.fillStyle = "rgba(0, 0, 0, 1)"
   context.beginPath()
   context.arc( obj.x, obj.y, 5, 0, 2*Math.PI );
   obj.filled ? context.fill() : context.stroke()
}