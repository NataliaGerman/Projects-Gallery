console.log('Starting up');

var gProjs;
var gNextId =1;


creatProgects();
function creatProgects() {
  var projects = [
    createProject('chess', 'chess', 'chess piece mooves', 'projs/Chess.index.html', ['chess', 'matrix']),

    createProject('minesweeper', 'minesweeper', 'online Minesweeper in JavaScript', 'projs/Minesweeper.index.html', ['minesweeper', 'matrix']),
  ];
  gProjs = projects;
}

function createProject(name, title, desc, url, labels) {
  return {
    id: gNextId++,
    name: name,
    title: title,
    desc: desc,
    url: url,
    publishedAt: new Date(),
    labels: labels
  }
}

console.log(gProjs)


function renderProjects() {
  var strHtmls = gProjs.map(function (proj) {
    return `<div class="col-md-4 col-sm-6 portfolio-item">
  <a class="portfolio-link" data-toggle="modal" href="#portfolioModal">
    <div class="portfolio-hover" onclick="renderModal(${proj.id})"> 
      <div class="portfolio-hover-content">
        <i class="fa fa-plus fa-3x"></i>
       </div>
    </div>
    <img class="img-fluid"  src="img/portfolio/${proj.id}-thumbnail.jpg" alt="" >
  </a>
  <div class="portfolio-caption">
    <h4>${proj.name}</h4>
    <p class="text-muted">${proj.desc}</p>
  </div>
</div>`})
  console.log(strHtmls.join(''))
  $('.proj-container').html(strHtmls.join(''))
}

console.log(renderProjects())

function getProj(id) {
  return gProjs.find(function (proj) {
    return proj.id === id
  })
}

function renderModal(id) {
  var proj = getProj(id)
  console.log(gProjs)
  var $modal = $('.portfolio-modal');
  $modal.find('h2').text(proj.name)
  $modal.find('.item-intro').text(proj.title);
  $modal.find('.desc').text(proj.desc);
  $modal.find('.list-inline').find('.date').text(proj.publishedAt)
  $modal.find('.img-fluid').click(function () { openProj(proj.id) })
}

function openProj(id){
  console.log('openning')
  var proj=getProj(id)
  var link=`projs/${proj.name}/index.html`
  window.location.href= link;
  //window.location.href = 
  //<a href='projs/Chess.index.html'>link</a>
}