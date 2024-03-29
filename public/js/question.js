var stream = 'CSE';
if (localStorage.getItem('admintoken')) {
} else {
  window.location.href = '/admin'
}


const selectStream = (value) => {
  stream = value;
  // console.log(stream);
  getquiz();
}

document.getElementById("question_txt").addEventListener("submit", function (e) {
  e.preventDefault();
  fetch(e.target.action, {
    method: e.target.method,
    headers: {
      'auth_token': `${localStorage.getItem('admintoken')}`
    },
    body: new FormData(e.target),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      if (data.status == 0) {
        // console.log(data);
        alert("Question added successfully");
        getquiz();
      }else {
        alert("Error adding question");
        localStorage.removeItem('admintoken')
        window.location.href = '/admin'
      }
    })
    .catch((err) => {
      alert("Error adding question");
    });
});


const getquiz = () => {
  fetch(`/question/sendquestion`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      'stream': `${stream}`
    })
  })
    .then((res) => res.json())
    .then((res) => {
      // console.log(res);
      if (res.status === 0) {
        displayquestion(res.data);
      }
    })
    .catch()
}

const arrayBufferToBase64 = (buffer) => {
  var binary = '';
  var bytes = [].slice.call(new Uint8Array(buffer));
  bytes.forEach((b) => binary += String.fromCharCode(b));
  return window.btoa(binary);
};

const displayquestion = (data) => {
  // console.log(data);
  var html = ``;
  var htQuestion = `Total Question : ${data.length}`;
  for (var i = 0; i < data.length; i++) {
    var idxnew = (Number)(i) + 1;
    // htQuestion += `<div class="short" onclick="previous(${i},${data.length})">${i + 1}</div>`
    html += `
      <div class="mcq" id="${i}">
              <h1><span>${idxnew}.</span> ${data[i].question}</h1>
              <ul>`

    if (data[i].image.contentType) {
      // console.log('image');
      var img = arrayBufferToBase64(data[i]['image'].data.data);
      var imgSrc = `data:image/${data[i].image.contentType};base64,${img.toString('base64')}`;
      html += `<img src='${imgSrc}' alt='server error'/>`
    }

    for (j in data[i].choice) {
      // console.log(i);
      var idxoption = (Number)(j) + 1;
      html += `<li id="${data[i].id}_option${j}" onclick="setAnswer('${data[i].id}','${j}','${data[i].choice[j]}')"><span> ${idxoption} </span> ${data[i].choice[j]}</li>`
    }
    html += `</ul>
              <div class="answer"></div>`
    // <div class="differentquestion">`

    // if (i > 0) {
    //     var idx = (Number)(i) - 1;
    //     html += `<button type="submit" onclick="previous(${idx},${data.length})"> Previous </button>`
    // } else {
    //     html += `<button type="submit" disabled> Previous </button>`
    // }

    // if (Number(i) < data.length - 1) {
    //     var idx = (Number)(i) + 1;
    //     html += `<button type="submit" onclick="next(${idx},${data.length})" > Next </button>`
    // } else {
    //     html += `<button type="submit" disabled> Next </button>`
    // }

    html += `</div>`
    // if (Number(i) === data.length - 1) {
    //     // console.log(i);
    //     html += `<div class="submitbutton">
    //             <button type="submit" onclick="submitAnswer()"> Submit </button>
    //         </div>`
    // }
    html += `</div>`
  }
  document.getElementById('quizdisplay').innerHTML = html;
  document.getElementById('questionshow').innerHTML = htQuestion;
}

getquiz();