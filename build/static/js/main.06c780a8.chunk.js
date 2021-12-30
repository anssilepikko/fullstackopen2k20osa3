(this.webpackJsonppuhelinluettelo=this.webpackJsonppuhelinluettelo||[]).push([[0],{39:function(e,n,t){},40:function(e,n,t){"use strict";t.r(n);var o=t(15),c=t.n(o),r=t(6),a=t(3),u=t(2),i=t(0),s=function(e){var n=e.person,t=e.handleRemove;return Object(i.jsxs)("li",{className:"note",children:[n.name," / ",n.number," / ",n.id," / ",Object(i.jsx)("button",{type:"button",className:"button",onClick:function(){return t(n.id)},children:"Remove"})]})},l=function(e){var n=e.numbers,t=e.handleRemove;return Object(i.jsx)(i.Fragment,{children:n.map((function(e){return Object(i.jsx)(s,{person:e,handleRemove:t},e.id)}))})},d=function(e){var n=e.addPerson,t=e.newName,o=e.handleName,c=e.newNumber,r=e.handleNumber;return Object(i.jsx)("div",{children:Object(i.jsxs)("form",{onSubmit:n,children:[Object(i.jsxs)("div",{children:["Name: ",Object(i.jsx)("input",{value:t,onChange:o})]}),Object(i.jsxs)("div",{children:["Number: ",Object(i.jsx)("input",{value:c,onChange:r})]}),Object(i.jsx)("div",{children:Object(i.jsx)("button",{type:"submit",children:"Add a new person"})})]})})},m=function(e){var n=e.newFilter,t=e.handleName;return Object(i.jsxs)("div",{children:["Filter: ",Object(i.jsx)("input",{value:n,onChange:t})]})},b=function(e){var n=e.message;return null===n?null:Object(i.jsx)("div",{className:"error",children:n})},j=t(4),f=t.n(j),h="http://localhost:3001/api/persons",v=function(){var e=f.a.get(h);return console.log("persons.js / getAll / request",e),e.then((function(e){return e.data}))},p=function(e){return f.a.post(h,e).then((function(e){return e.data}))},O=function(e,n){var t=f.a.put("".concat(h,"/").concat(e),n);return console.log("persons.js / update / request",t),t.then((function(e){return e.data}))},g=function(e){var n=f.a.delete("".concat(h,"/").concat(e));return console.log("persons.js / remove / request",n),n.then((function(e){return e.data}))},x=(t(39),function(e){var n=Object(u.useState)([]),t=Object(a.a)(n,2),o=t[0],c=t[1],s=Object(u.useState)(""),j=Object(a.a)(s,2),f=j[0],h=j[1],x=Object(u.useState)(""),w=Object(a.a)(x,2),N=w[0],k=w[1],P=Object(u.useState)(""),R=Object(a.a)(P,2),C=R[0],F=R[1],S=Object(u.useState)(null),T=Object(a.a)(S,2),y=T[0],E=T[1];Object(u.useEffect)((function(){v().then((function(e){c(e)}))}),[]);var q=function(e){console.log(o),console.log("FindPerson input:",e);var n=o.find((function(n){return n.name===e}));return console.log("Found:",n),n};return Object(i.jsxs)("div",{children:[Object(i.jsx)("h2",{children:"Phonebook"}),Object(i.jsx)(d,{addPerson:function(e){if(e.preventDefault(),""!==f){var n={name:f,number:N};if(q(f)){if(window.confirm("'".concat(f,"' is already added to phonebook. Replace the number with a new one?"))){var t=o.find((function(e){return e.name===f})),a=Object(r.a)(Object(r.a)({},t),{},{number:N}),u=t.id;O(u,a).then((function(e){c(o.map((function(n){return n.id===u?e:n}))),E("Person '".concat(e.name,"' number changed!")),setTimeout((function(){E(null)}),5e3)})).catch((function(e){E("Error! '".concat(a.name,"' was not edited! Probably removed from server...")),setTimeout((function(){E(null)}),5e3)}))}console.log("Number update cancelled")}else p(n).then((function(e){c(o.concat(e)),E("Person '".concat(n.name,"' added!")),setTimeout((function(){E(null)}),5e3)})).catch((function(e){E("Error! '".concat(n.name,"' was not added!")),setTimeout((function(){E(null)}),5e3)})),console.log("New person added to phonebook:",n),h(""),k(""),F(""),console.log("Fields reset")}},name:f,handleName:function(e){h(e.target.value)},number:N,handleNumber:function(e){k(e.target.value)}}),Object(i.jsx)(b,{message:y}),Object(i.jsx)("h2",{children:"Numbers"}),Object(i.jsx)(m,{name:C,handleName:function(e){F(e.target.value)}}),Object(i.jsx)("ul",{children:Object(i.jsx)(l,{numbers:""===C?o:o.filter((function(e){return e.name.toUpperCase().includes(C.toUpperCase())})),handleRemove:function(e){console.log("app.js / handleRemove / id:",e);var n=o.find((function(n){return n.id===e}));window.confirm("Remove '".concat(n.name,"' from phonebook?"))&&g(e).then((function(){var t=o.filter((function(n){return n.id!==e}));c(t),console.log("Person '".concat(n.name,"' removed from phonebook")),E("Person '".concat(n.name,"' removed from phonebook")),setTimeout((function(){E(null)}),5e3)})).catch((function(e){E("Error! '".concat(n.name,"' was not removed!")),setTimeout((function(){E(null)}),5e3)}))}})})]})});c.a.render(Object(i.jsx)(x,{}),document.getElementById("root"))}},[[40,1,2]]]);
//# sourceMappingURL=main.06c780a8.chunk.js.map