import prodb, {
  bulkcreate,
  createEle,
  getData,
  SortObj
} from "./module.js";


let db = prodb("Productdb", {
  products: `++id, name, seller, price`
});

// input tags ...
const userid = document.getElementById("userid");
const proname = document.getElementById("proname");
const seller = document.getElementById("seller");
const price = document.getElementById("price");

// create button
const btncreate = document.getElementById("btn-create");
const btnread = document.getElementById("btn-read");
const btnupdate = document.getElementById("btn-update");
const btndelete = document.getElementById("btn-delete");

// user data

// event listerner for create button
btncreate.onclick = event => {
  // insert values
  let flag = bulkcreate(db.products, {
    name: proname.value,
    seller: seller.value,
    price: price.value
  });
  // reset textbox values
  //proname.value = "";
  //seller.value = "";
  // price.value = "";
  proname.value = seller.value = price.value = "";

  // set id textbox value
  getData(db.products, data => {
    userid.value = data.id + 1 || 1;
  });
  table();

  let insertmsg = document.querySelector(".insertmsg");
  getMsg(flag, insertmsg);
};

// event listerner for create button
// btnread.onclick = table;

// button update
btnupdate.onclick = () => {
  const id = parseInt(userid.value || 0);
  if (id) {
    // call dexie update method
    db.products.update(id, {
      name: proname.value,
      seller: seller.value,
      price: price.value
    }).then((updated) => {
      // let get = updated ? `data updated` : `couldn't update data`;
      let get = updated ? true : false;

      // display message
      let updatemsg = document.querySelector(".updatemsg");
      getMsg(get, updatemsg);

      proname.value = seller.value = price.value = "";
      //console.log(get);
    })
  } else {
    console.log(`Please Select id: ${id}`);
    console.log('aken laeti uuesti');
  }
  db.open();                                                               //täiendus 
  table();                                                                 //täiendus 
}

// delete button
btndelete.onclick = () => {
  db.delete();
  db = prodb("Productdb", {
    products: `++id, name, seller, price`
  });
  db.open();
  table();
  textID(userid);
  // display message
  let deletemsg = document.querySelector(".deletemsg");
  getMsg(true, deletemsg);
}

window.onload = event => {
  // set id textbox value
  textID(userid);
  db.open();                                                                //täiendus
  table();                                                                  //täiendus
 

  console.log("aken laeti uuesti");

};



// create dynamic table
function table() {
  const tbody = document.getElementById("tbody");
  const notfound = document.getElementById("notfound");
  notfound.textContent = "";
  // remove all childs from the dom first
  while (tbody.hasChildNodes()) {
    tbody.removeChild(tbody.firstChild);
  }


  getData(db.products, (data, index) => {
    if (data) {
      createEle("tr", tbody, tr => {
        tr.setAttribute(`data-id`, data.id);                              //täiendus
        tr.onclick = editbtn;                                             //täiendus 
        for (const value in data) {
          createEle("td", tr, td => {
            td.textContent = data.price === data[value] ? `${data[value]}€` : data[value];
          });
        }
        // createEle("td", tr, td => {
        //   createEle("i", td, i => {
        //     i.className += "fas fa-edit btnedit";
        //     i.setAttribute(`data-id`, data.id);
        //     // store number of edit buttons
        //     i.onclick = editbtn;
        //   });
        //})
        createEle("td", tr, td => {
          createEle("i", td, i => {
            i.className += "fas fa-trash-alt btndelete";
            i.setAttribute(`data-id`, data.id);
            // store number of edit buttons
            i.onclick = deletebtn;
          });
        })
      });
    } else {
      notfound.textContent = "No record found in the database...!";
    }

  });
}

const editbtn = (event) => {
  //let id = parseInt(event.target.dataset.id);
  let id = parseInt(event.target.parentNode.getAttribute("data-id"));   //täiendus 
  console.log(event.target.parentNode.getAttribute("data-id"));         //täiendus 
  console.log(id);                                                      //täiendus 
  
  db.products.get(id, function (data) {
    let newdata = SortObj(data);
    userid.value = newdata.id || 0;
    proname.value = newdata.name || "";
    seller.value = newdata.seller || "";
    price.value = newdata.price || "";
  });
}

// delete icon remove element 
const deletebtn = event => {
  let id = parseInt(event.target.dataset.id);
  db.products.delete(id);
  console.log(event.target.getAttribute("data-id"));
  table();
}

// textbox id
function textID(textboxid) {
  getData(db.products, data => {
    textboxid.value = data.id + 1 || 1;
  });
}

// function msg
function getMsg(flag, element) {
  if (flag) {
    // call msg 
    element.className += " movedown";

    setTimeout(() => {
      element.classList.forEach(classname => {
        classname == "movedown" ? undefined : element.classList.remove('movedown');
      })
    }, 4000);
  }
}