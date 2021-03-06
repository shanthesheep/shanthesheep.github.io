var inpCourse = document.getElementById('course');
var inpPassword = document.getElementById('sn');
var btnSubmit = document.getElementById('submit');

inpCourse.addEventListener('change', function(e){
  var elem = document.getElementById(inpCourse.value);
  var courses = document.getElementsByClassName('course');
  for(i=0; i<courses.length ; i++){
    if (courses[i].style.display !== 'none') {
        courses[i].style.display = 'none';
    }
  }
  elem.style.display = 'block';
});

btnSubmit.addEventListener('click', function(e){
  console.log('Sending Data ...');
  if(inpCourse.value != '0'){
    var data = {};
    data.pw = inpPassword.value;
    var d = {};
    d.course = inpCourse.value;
    var p = computeProficiencies();
    d.profs = JSON.stringify(p);
    data.d = JSON.stringify(d);
    //console.log(JSON.stringify(data));
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://sirfizx.pythonanywhere.com/api/update/', true);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhr.send(JSON.stringify(data));
    xhr.onload = function (e) {
      if (xhr.readyState === 4) {
        if (xhr.status === 200 && !xhr.responseText.startsWith('A')) {
          var o = JSON.parse(xhr.responseText);
          console.log(o);
          printSummary(o.student[0]);
        } else {
          console.error(xhr.statusText);
          console.error(xhr.responseText);
        }
      }
    };
    xhr.onerror = function (e) {
      console.warn('ERROR');
    };
  }else{
    console.warn('Choose a course!');
  }
});

var pts = document.getElementsByClassName('pt');
//console.log('pts : ' , pts);
for(i=0;i<pts.length;i++){
  pts[i].green = false;
  pts[i].addEventListener('click',function(e){
    if(e.target.style.backgroundColor=='pink' || e.target.style.backgroundColor=='rgb(255, 192, 203)'){
       e.target.style.backgroundColor='green';
       e.target.style.color='white';
       e.target.green = true;
    }else{
      e.target.style.backgroundColor='pink';
      e.target.style.color='black';
      e.target.green = false;
    }
  }.bind(pts[i]));
}

function computeProficiencies(){
  var profs = {};
  var courseElement = document.getElementById(inpCourse.value);
  var lts = courseElement.getElementsByClassName('lt');
  for(i=0;i<lts.length;i++){
    var ptasks = lts[i].getElementsByClassName('pt');
    var numGreen = 0;
    for(j=0;j<ptasks.length;j++){
      if(ptasks[j].green) numGreen++;
    }
    //console.log(ptasks);
    var scaleValue = Math.round(4*numGreen/ptasks.length);
    if(scaleValue === 0) scaleValue = 1;
    var s = lts[i].getElementsByTagName('h3')[0].innerText;
    profs[s]=scaleValue;
  }
  //console.log(profs);
  return profs;
}


function printSummary(results){
  let data = JSON.parse(results.data);
  console.log(data.profs);
  var profs = data.profs;
  profs = JSON.parse(profs);
  var output = document.getElementById('output');
  output.style.fontSize = '20px';
  for (var pt in profs) {
    if (profs.hasOwnProperty(pt)) {
      console.log(pt , profs[pt]);
      let r = document.createElement('div');
      r.style.fontWeight = 'bold';
      switch(profs[pt]){
        case 1: r.style.color = 'red';
          break;
        case 2: r.style.color = 'orange';
          break;
        case 3: r.style.color = 'blue';
          break;
        case 4: r.style.color = 'green';
          break;
      }
      r.innerText = pt + '  ' + profs[pt];
      output.appendChild(r);
    }
  }
  window.scrollTo(0,document.body.scrollHeight);
}

// var aTags = document.getElementsByTagName("a");
// var searchText = "SearchingText";
// var found;
//
// for (var i = 0; i < aTags.length; i++) {
//   if (aTags[i].textContent == searchText) {
//     found = aTags[i];
//     break;
//   }
// }
