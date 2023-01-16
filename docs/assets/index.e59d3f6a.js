import{o as c,c as d,a as i,A as Y,n as p,w as f,v as U,b as P,F as D,r as k,t as u,d as w,p as $,e as E,f as H,g as h,h as v,i as S,j as G,k as q,l as Q,m as X,I as Z,q as ee}from"./vendor.6995f699.js";const te=function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const l of r.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&n(l)}).observe(document,{childList:!0,subtree:!0});function a(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerpolicy&&(r.referrerPolicy=s.referrerpolicy),s.crossorigin==="use-credentials"?r.credentials="include":s.crossorigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=a(s);fetch(s.href,r)}};te();var g=(e,t)=>{const a=e.__vccOpts||e;for(const[n,s]of t)a[n]=s;return a};const se={name:"AppHeader"},ae={class:"header"},re=i("h1",{class:"header__h1"},"\u041E\u0442\u0447\u0435\u0442\u044B",-1),le=[re];function ne(e,t,a,n,s,r){return c(),d("header",ae,le)}var ie=g(se,[["render",ne]]);const C=e=>{let t,a,n;return t=e.getDate(),t<10&&(t="0"+t),a=e.getMonth()+1,a<10&&(a="0"+a),n=e.getFullYear(),t+"."+a+"."+n},T=e=>{let t,a,n;return t=Math.floor(e/3600),a=Math.floor(e/60)-t*60,n=e%60,[t.toString().padStart(2,"0"),a.toString().padStart(2,"0"),n.toString().padStart(2,"0")].join(":")},oe=e=>{if(!e)return 0;let t,a,n;return e=e.split(":"),t=parseInt(e[0])||0,a=parseInt(e[1])||0,n=parseInt(e[2])||0,t*3600+a*60+n},ce=()=>{const e=new Date;return[e,e]},W=()=>{const e=new Date;let t=new Date(e-(e.getDay()-1)*864e5),a=new Date(e-(e.getDay()-1)*864e5+6*864e5);return[t,a]},de=()=>{const e=new Date;let t=new Date(e.getFullYear(),e.getMonth(),1),a=new Date(e.getFullYear(),e.getMonth()+1,0);return[t,a]},ue=()=>{const e=new Date;return new Date(e.getFullYear(),e.getMonth(),1)},b={677:[677,881,999]},j=async(e,t)=>{const a=(l,o,y)=>(o.start=y,fetch(l,{method:"post",headers:{"Content-Type":"application/json"},body:JSON.stringify(o)}).then(I=>I.json()));let n=[],s=0,r=null;for(;r===null||s<r;){let l=a(e,t,s);if(r===null){let o=await l;r=parseInt(o.total)}n.push(l),s+=50}return Promise.all(n)},J=async(e,t)=>fetch(e+"/task.elapseditem.getlist",{method:"post",headers:{"Content-Type":"application/json"},body:JSON.stringify({order:{ID:"asc"},filter:t,select:["ID","TASK_ID","SECONDS","CREATED_DATE"],params:{NAV_PARAMS:{nPageSize:0}}})}).then(a=>a.json()).then(a=>a.result),_e=async(e,t)=>j(e+"/tasks.task.list",{order:{ID:"asc"},filter:t,select:["ID","TITLE","GROUP_ID"]}).then(a=>a.reduce((n,s)=>n.concat(s.result.tasks),[])),ye=async(e,t)=>fetch(e+"/sonet_group.get",{method:"post",headers:{"Content-Type":"application/json"},body:JSON.stringify({ORDER:{ID:"asc"},FILTER:t})}).then(a=>a.json()).then(a=>a.result),K=async e=>{const t=B(e);return b[t]!==void 0?!0:fetch(e+"/user.admin.json",{method:"post",headers:{"Content-Type":"application/json"}}).then(a=>a.json()).then(a=>a.result).catch(()=>!1)},z=async e=>{const t=B(e);let a={ACTIVE:"true"};return b[t]!==void 0&&(a.ID=b[t]),j(e+"/user.get",{sort:"LAST_NAME",order:"asc",filter:a}).then(n=>n.reduce((s,r)=>s.concat(r.result),[]))},he=async(e,t)=>fetch("https://isdayoff.ru/api/getdata?year="+e+"&month="+t+"&delimeter=|&covid=1").then(a=>a.text()),B=e=>e.match(/rest\/(\d+)/)[1]||!1;const ge={data(){return{apiUrl:this.$store.state.weeklyApiUrl,userId:this.$store.state.weeklyUserId,start:this.$store.state.weeklyDateFrom,end:this.$store.state.weeklyDateTo,datePickerInst:!1,users:[],isUserAdmin:!1,isLoading:!1}},created(){this.getUsers()},mounted(){let e={content:"\u0414\u0435\u043D\u044C",onClick:n=>{let s=ce();n.selectDate(s),n.setViewDate(s[0])}},t={content:"\u041D\u0435\u0434\u0435\u043B\u044F",onClick:n=>{let s=W();n.selectDate(s),n.setViewDate(s[0])}},a={content:"\u041C\u0435\u0441\u044F\u0446",onClick:n=>{let s=de();n.selectDate(s),n.setViewDate(s[0])}};this.datePickerInst=new Y("[name=dates]",{range:!0,multipleDatesSeparator:" - ",selectedDates:[this.start,this.end],buttons:[e,t,a],toggleSelected:!1,onSelect(n){n.date.length==2&&n.datepicker.hide()}})},watch:{apiUrl(){this.setUserId(),this.getUsers()},users(){this.isLoading=!1}},methods:{async getUsers(){this.apiUrl&&(this.isLoading=!0,this.isUserAdmin=await K(this.apiUrl),this.isUserAdmin?this.users=await z(this.apiUrl):this.users=[])},setSettings(){this.$store.commit("weeklyApiChange",{weeklyApiUrl:this.apiUrl}),this.$store.commit("weeklyUserChange",{weeklyUserId:this.userId}),this.$store.commit("weeklyDateChange",{weeklyDateFrom:this.datePickerInst.selectedDates[0],weeklyDateTo:this.datePickerInst.selectedDates[1]||this.datePickerInst.selectedDates[0]})},setUserId(){if(this.apiUrl){let e=!1;(e=this.apiUrl.match(/rest\/(\d+)/))&&(this.userId=e[1]||!1)}else this.userId=!1}}},L=e=>($("data-v-f23a44fa"),e=e(),E(),e),pe={class:"settings__items"},me=L(()=>i("label",{class:"settings__label"},"\u0421\u0442\u0440\u043E\u043A\u0430 API",-1)),fe={key:0,class:"settings__item"},De=L(()=>i("label",{class:"settings__label"},"\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C",-1)),ke=["value"],Ie=L(()=>i("div",{class:"settings__item"},[i("label",{class:"settings__label"},"\u041F\u0435\u0440\u0438\u043E\u0434"),i("input",{class:"settings__input",type:"text",name:"dates"})],-1)),ve={class:"settings__item"};function Se(e,t,a,n,s,r){return c(),d("div",{class:p(["settings",{"is-loading":s.isLoading}])},[i("div",pe,[i("div",{class:p(["settings__item",{"settings__item--2":!s.isUserAdmin}])},[me,f(i("input",{"onUpdate:modelValue":t[0]||(t[0]=l=>s.apiUrl=l),class:"settings__input",type:"text"},null,512),[[U,s.apiUrl]])],2),s.isUserAdmin?(c(),d("div",fe,[De,f(i("select",{"onUpdate:modelValue":t[1]||(t[1]=l=>s.userId=l),class:"settings__input"},[(c(!0),d(D,null,k(s.users,l=>(c(),d("option",{key:l.ID,value:l.ID},u(l.LAST_NAME)+" "+u(l.NAME)+" ("+u(l.ID)+") ",9,ke))),128))],512),[[P,s.userId]])])):w("",!0),Ie,i("div",ve,[i("button",{class:"settings__btn",onClick:t[2]||(t[2]=(...l)=>r.setSettings&&r.setSettings(...l))}," \u041F\u0440\u0438\u043C\u0435\u043D\u0438\u0442\u044C ")])])],2)}var we=g(ge,[["render",Se],["__scopeId","data-v-f23a44fa"]]);const Ue={data(){return{result:[],isLoading:!1}},computed:{settings(){return{apiUrl:this.$store.state.weeklyApiUrl,userId:this.$store.state.weeklyUserId,dateFrom:this.$store.state.weeklyDateFrom,dateTo:this.$store.state.weeklyDateTo}},summChecked(){return this.result.reduce((e,t)=>e+=t.selected?t.seconds:0,0)},summTotal(){return this.result.reduce((e,t)=>e+=t.seconds,0)}},created(){this.getResult()},watch:{settings(){this.getResult()},result(){this.isLoading=!1}},methods:{formatDate:C,formatTime:T,async getResult(){if(!this.settings.apiUrl||!this.settings.userId)return!1;this.isLoading=!0;const[e,t,a]=await this.getResultData();let n={0:{id:0,name:"\u041D\u0435\u0442 \u0434\u043E\u0441\u0442\u0443\u043F\u0430 \u043A \u0433\u0440\u0443\u043F\u043F\u0435",seconds:0,selected:this.result[0]?this.result[0].selected:!1,tasks:{0:{id:0,name:"\u041D\u0435\u0442 \u0434\u043E\u0441\u0442\u0443\u043F\u0430 \u043A \u0437\u0430\u0434\u0430\u0447\u0435 \u0438\u043B\u0438 \u0437\u0430\u0434\u0430\u0447\u0430 \u0443\u0434\u0430\u043B\u0435\u043D\u0430",seconds:0}}}};a.forEach(r=>{n[r.ID]={id:r.ID,name:r.NAME,seconds:0,selected:this.result[r.ID]?this.result[r.ID].selected:!1,tasks:{}}});let s={0:0};t.forEach(r=>{let l=n[r.groupId],o=l?l.id:0;s[r.id]=o,n[o].tasks[r.id]={id:r.id,name:r.title,seconds:0}}),e.forEach(r=>{let l=n[s[r.TASK_ID]],o=l?l.id:0,y=n[o].tasks[r.TASK_ID],I=y?y.id:0;n[o].seconds+=parseInt(r.SECONDS),n[o].tasks[I].seconds+=parseInt(r.SECONDS)}),this.result=Object.values(n).filter(r=>(r.tasks=Object.values(r.tasks).filter(l=>l.seconds),r.seconds))},async getResultData(){let e=[],t={USER_ID:this.settings.userId,">=CREATED_DATE":C(this.settings.dateFrom)+" 00:00:00","<=CREATED_DATE":C(this.settings.dateTo)+" 23:59:59"};t.USER_ID&&(e=await J(this.settings.apiUrl,t));let a=[];t={ID:e.map(s=>s.TASK_ID)},t.ID.length&&(a=await _e(this.settings.apiUrl,t));let n=[];return t={ID:a.map(s=>s.groupId)},t.ID.length&&(n=await ye(this.settings.apiUrl,t)),[e,a,n]}}},Ae=i("svg",{fill:"currentColor",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 30 30"},[i("path",{d:"M 15 3 C 12.031398 3 9.3028202 4.0834384 7.2070312 5.875 A 1.0001 1.0001 0 1 0 8.5058594 7.3945312 C 10.25407 5.9000929 12.516602 5 15 5 C 20.19656 5 24.450989 8.9379267 24.951172 14 L 22 14 L 26 20 L 30 14 L 26.949219 14 C 26.437925 7.8516588 21.277839 3 15 3 z M 4 10 L 0 16 L 3.0507812 16 C 3.562075 22.148341 8.7221607 27 15 27 C 17.968602 27 20.69718 25.916562 22.792969 24.125 A 1.0001 1.0001 0 1 0 21.494141 22.605469 C 19.74593 24.099907 17.483398 25 15 25 C 9.80344 25 5.5490109 21.062074 5.0488281 16 L 8 16 L 4 10 z"})],-1),Ce=[Ae],Te={key:0,class:"weekly__items"},be={class:"weekly__label"},$e=["onUpdate:modelValue"],Ee={class:"weekly__tasks"},Le={key:1,class:"weekly__footer"},xe={class:"weekly__checked"},Fe={class:"weekly__total"},Re={key:2,class:"weekly__empty"};function Me(e,t,a,n,s,r){return c(),d("div",{class:p(["weekly",{"is-loading":s.isLoading}])},[i("div",{class:"weekly__refresh",title:"\u041E\u0431\u043D\u043E\u0432\u0438\u0442\u044C \u0434\u0430\u043D\u043D\u044B\u0435",onClick:t[0]||(t[0]=(...l)=>r.getResult&&r.getResult(...l))},Ce),s.result.length?(c(),d("div",Te,[(c(!0),d(D,null,k(s.result,l=>(c(),d("div",{key:l.id,class:"weekly__item"},[i("label",be,[f(i("input",{"onUpdate:modelValue":o=>l.selected=o,class:"weekly__checkbox",type:"checkbox",value:"group.id"},null,8,$e),[[H,l.selected]]),i("b",null,u(l.name),1),h(" ("+u(r.formatTime(l.seconds))+") ",1)]),i("div",Ee,[(c(!0),d(D,null,k(l.tasks,o=>(c(),d("div",{key:o.id,class:"weekly__task"},u(o.id)+" - "+u(o.name)+" ("+u(r.formatTime(o.seconds))+") ",1))),128))])]))),128))])):w("",!0),s.result.length?(c(),d("div",Le,[i("div",xe," \u0421\u0443\u043C\u043C\u0430 \u0432\u044B\u0431\u0440\u0430\u043D\u043D\u044B\u0445: "+u(r.formatTime(r.summChecked)),1),i("div",Fe," \u0412\u0441\u0435\u0433\u043E \u0437\u0430\u0442\u0440\u0430\u0447\u0435\u043D\u043E: "+u(r.formatTime(r.summTotal)),1)])):w("",!0),s.result.length?w("",!0):(c(),d("div",Re,"\u0414\u0430\u043D\u043D\u044B\u0445 \u043D\u0435\u0442"))],2)}var Ne=g(Ue,[["render",Me]]);const Oe={components:{SettingsWeekly:we,Weekly:Ne}};function Ve(e,t,a,n,s,r){const l=v("SettingsWeekly"),o=v("Weekly");return c(),d("div",null,[S(l),S(o)])}var Ye=g(Oe,[["render",Ve]]);const Pe={data(){return{apiUrl:this.$store.state.yearlyApiUrl,userId:this.$store.state.yearlyUserId,date:this.$store.state.yearlyDate,datePickerInst:!1,users:[],isUserAdmin:!1,isLoading:!1}},created(){this.getUsers()},mounted(){this.datePickerInst=new Y("[name=year]",{view:"years",minView:"years",dateFormat:"yyyy",range:!1,selectedDates:this.date,toggleSelected:!1,onSelect(e){e.datepicker.hide()}})},watch:{apiUrl(){this.setUserId(),this.getUsers()},users(){this.isLoading=!1}},methods:{async getUsers(){this.apiUrl&&(this.isLoading=!0,this.isUserAdmin=await K(this.apiUrl),this.isUserAdmin?this.users=await z(this.apiUrl):this.users=[])},setSettings(){this.$store.commit("yearlyApiChange",{yearlyApiUrl:this.apiUrl}),this.$store.commit("yearlyUserChange",{yearlyUserId:this.userId}),this.$store.commit("yearlyDateChange",{yearlyDate:this.datePickerInst.selectedDates[0]})},setUserId(){if(this.apiUrl){let e=!1;(e=this.apiUrl.match(/rest\/(\d+)/))&&(this.userId=e[1]||!1)}else this.userId=!1}}},x=e=>($("data-v-468e63aa"),e=e(),E(),e),We={class:"settings__items"},je=x(()=>i("label",{class:"settings__label"},"\u0421\u0442\u0440\u043E\u043A\u0430 API",-1)),Je={key:0,class:"settings__item"},Ke=x(()=>i("label",{class:"settings__label"},"\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C",-1)),ze=["value"],Be=x(()=>i("div",{class:"settings__item"},[i("label",{class:"settings__label"},"\u041F\u0435\u0440\u0438\u043E\u0434"),i("input",{class:"settings__input",type:"text",name:"year"})],-1)),He={class:"settings__item"};function Ge(e,t,a,n,s,r){return c(),d("div",{class:p(["settings",{"is-loading":s.isLoading}])},[i("div",We,[i("div",{class:p(["settings__item",{"settings__item--2":!s.isUserAdmin}])},[je,f(i("input",{class:"settings__input",type:"text","onUpdate:modelValue":t[0]||(t[0]=l=>s.apiUrl=l)},null,512),[[U,s.apiUrl]])],2),s.isUserAdmin?(c(),d("div",Je,[Ke,f(i("select",{class:"settings__input","onUpdate:modelValue":t[1]||(t[1]=l=>s.userId=l)},[(c(!0),d(D,null,k(s.users,l=>(c(),d("option",{key:l.ID,value:l.ID},u(l.LAST_NAME)+" "+u(l.NAME)+" ("+u(l.ID)+") ",9,ze))),128))],512),[[P,s.userId]])])):w("",!0),Be,i("div",He,[i("button",{class:"settings__btn",onClick:t[2]||(t[2]=(...l)=>r.setSettings&&r.setSettings(...l))},"\u041F\u0440\u0438\u043C\u0435\u043D\u0438\u0442\u044C")])])],2)}var qe=g(Pe,[["render",Ge],["__scopeId","data-v-468e63aa"]]);const Qe={data(){return{result:[],months:["\u042F\u043D\u0432\u0430\u0440\u044C","\u0424\u0435\u0432\u0440\u0430\u043B\u044C","\u041C\u0430\u0440\u0442","\u0410\u043F\u0440\u0435\u043B\u044C","\u041C\u0430\u0439","\u0418\u044E\u043D\u044C","\u0418\u044E\u043B\u044C","\u0410\u0432\u0433\u0443\u0441\u0442","\u0421\u0435\u043D\u0442\u044F\u0431\u0440\u044C","\u041E\u043A\u0442\u044F\u0431\u0440\u044C","\u041D\u043E\u044F\u0431\u0440\u044C","\u0414\u0435\u043A\u0430\u0431\u0440\u044C"],isLoading:!1}},computed:{settings(){return{apiUrl:this.$store.state.yearlyApiUrl,userId:this.$store.state.yearlyUserId,date:this.$store.state.yearlyDate,deltaSeconds:this.$store.state.yearlyDeltaSeconds,deltaDays:this.$store.state.yearlyDeltaDays}},totalSeconds(){return this.result.reduce((e,t)=>e+=t.seconds,0)},totalDeltaSeconds(){return this.result.reduce((e,t)=>e+=this.unformatTime(t.deltaSeconds),0)},totalDays(){return this.result.reduce((e,t)=>e+=this.getFloat(t.days),0)},totalDeltaDays(){return this.result.reduce((e,t)=>e+=this.getFloat(t.deltaDays),0)}},mounted(){this.getResult()},watch:{settings(){this.getResult()},result(){this.isLoading=!1}},methods:{formatTime:T,unformatTime:oe,async getResult(){var y,I,F,R,M,N,O,V;let e=[],t=this.settings.userId,a=this.settings.date.getFullYear(),n=this.settings.deltaSeconds,s=this.settings.deltaDays;this.isLoading=!0;let r=JSON.parse(localStorage.getItem("yearlyDays"));this.months.forEach((_,m)=>{e[m]={k:m,name:_,seconds:0,deltaSeconds:null,days:0,deltaDays:null,result:0}});for(const _ of e){let m=await this.getMonthWorkDays(a,_.k+1);e[_.k].days=m,((I=(y=n==null?void 0:n[t])==null?void 0:y[a])==null?void 0:I[_.k])&&(e[_.k].deltaSeconds=T(n[t][a][_.k])),((R=(F=r==null?void 0:r[t])==null?void 0:F[a])==null?void 0:R[_.k])&&!((N=(M=s==null?void 0:s[t])==null?void 0:M[a])==null?void 0:N[_.k])&&(s[t]||(s[t]={}),s[t][a]||(s[t][a]={}),s[t][a][_.k]=m-r[t][a][_.k],localStorage.setItem("yearlyDeltaDays",JSON.stringify(s)),delete r[t][a][_.k],localStorage.setItem("yearlyDays",JSON.stringify(r))),((V=(O=s==null?void 0:s[t])==null?void 0:O[a])==null?void 0:V[_.k])&&(e[_.k].deltaDays=s[t][a][_.k])}let l=[],o={USER_ID:t,">=CREATED_DATE":"01.01."+a+" 00:00:00","<=CREATED_DATE":"31.12."+a+" 23:59:59"};o.USER_ID&&(l=await J(this.settings.apiUrl,o)),l.forEach(_=>{let m=new Date(_.CREATED_DATE);e[m.getMonth()].seconds+=parseInt(_.SECONDS)}),this.result=e,this.recalcResult()},changeSeconds(e,t){var r,l;let a=this.settings.deltaSeconds,n=this.settings.userId,s=this.settings.date.getFullYear();t=this.unformatTime(t),((l=(r=a[n])==null?void 0:r[s])==null?void 0:l[e])!=t&&(a[n]||(a[n]={}),a[n][s]||(a[n][s]={}),t?a[n][s][e]=t:delete a[n][s][e],this.$store.commit("yearlyDeltaSecondsChange",{yearlyDeltaSeconds:a}),this.recalcResult())},changeDays(e,t){var r,l;let a=this.settings.deltaDays,n=this.settings.userId,s=this.settings.date.getFullYear();t=this.getFloat(t),((l=(r=a[n])==null?void 0:r[s])==null?void 0:l[e])!=t&&(a[n]||(a[n]={}),a[n][s]||(a[n][s]={}),t?a[n][s][e]=t:delete a[n][s][e],this.$store.commit("yearlyDeltaDaysChange",{yearlyDeltaDays:a}),this.recalcResult())},recalcResult(){this.result=this.result.map(e=>{let t=this.getFloat(e.seconds)-this.getFloat(this.unformatTime(e.deltaSeconds)),a=this.getFloat(e.days)-this.getFloat(e.deltaDays);return e.result=(Math.ceil(t/60/60/a*100)/100).toFixed(1),e})},async getMonthWorkDays(e,t){let a=0;return a=(await he(e,t)).split("|").reduce((s,r)=>r!=1?++s:s,0),a},getFloat(e){return parseFloat(String(e||0).replace(",","."))}}},A=e=>($("data-v-ba30b42a"),e=e(),E(),e),Xe=A(()=>i("svg",{fill:"currentColor",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 30 30"},[i("path",{d:"M 15 3 C 12.031398 3 9.3028202 4.0834384 7.2070312 5.875 A 1.0001 1.0001 0 1 0 8.5058594 7.3945312 C 10.25407 5.9000929 12.516602 5 15 5 C 20.19656 5 24.450989 8.9379267 24.951172 14 L 22 14 L 26 20 L 30 14 L 26.949219 14 C 26.437925 7.8516588 21.277839 3 15 3 z M 4 10 L 0 16 L 3.0507812 16 C 3.562075 22.148341 8.7221607 27 15 27 C 17.968602 27 20.69718 25.916562 22.792969 24.125 A 1.0001 1.0001 0 1 0 21.494141 22.605469 C 19.74593 24.099907 17.483398 25 15 25 C 9.80344 25 5.5490109 21.062074 5.0488281 16 L 8 16 L 4 10 z"})],-1)),Ze=[Xe],et={class:"yearly__table"},tt=A(()=>i("tr",null,[i("th",null,"\u041C\u0435\u0441\u044F\u0446"),i("th",null,"\u0420\u0430\u0431\u043E\u0447\u0435\u0435 \u0432\u0440\u0435\u043C\u044F"),i("th",null,"\u0420\u0430\u0431\u043E\u0447\u0438\u0435 \u0434\u043D\u0438"),i("th",null,"\u0412\u044B\u0440\u0430\u0431\u043E\u0442\u043A\u0430")],-1)),st={class:"is-name"},at={class:"is-seconds"},rt=h(" - "),lt=["onUpdate:modelValue","onChange","onKeyup"],nt=h(" = "),it={class:"is-days"},ot=h(" - "),ct=["onUpdate:modelValue","onChange","onKeyup"],dt=h(" = "),ut={class:"is-result"},_t=A(()=>i("td",null,null,-1)),yt={class:"is-seconds-result"},ht=h(" - "),gt=h(" = "),pt={class:"is-days-result"},mt=h(" - "),ft=h(" = "),Dt=A(()=>i("td",null,null,-1));function kt(e,t,a,n,s,r){const l=G("mask");return c(),d("div",{class:p(["yearly",{"is-loading":s.isLoading}])},[i("div",{class:"yearly__refresh",onClick:t[0]||(t[0]=(...o)=>r.getResult&&r.getResult(...o)),title:"\u041E\u0431\u043D\u043E\u0432\u0438\u0442\u044C \u0434\u0430\u043D\u043D\u044B\u0435"},Ze),i("table",et,[tt,(c(!0),d(D,null,k(s.result,o=>(c(),d("tr",{key:o.k},[i("td",st,u(o.name),1),i("td",at,[i("span",null,u(r.formatTime(o.seconds)),1),rt,i("span",null,[f(i("input",{type:"text","onUpdate:modelValue":y=>o.deltaSeconds=y,onChange:y=>r.changeSeconds(o.k,o.deltaSeconds),onKeyup:y=>r.changeSeconds(o.k,o.deltaSeconds)},null,40,lt),[[U,o.deltaSeconds],[l,{regex:"[0-9]*:[0-5][0-9]:[0-5][0-9]"}]])]),nt,i("span",null,[i("b",null,u(r.formatTime(o.seconds-r.unformatTime(o.deltaSeconds))),1)])]),i("td",it,[i("span",null,u(o.days),1),ot,i("span",null,[f(i("input",{type:"text","onUpdate:modelValue":y=>o.deltaDays=y,onChange:y=>r.changeDays(o.k,o.deltaDays),onKeyup:y=>r.changeDays(o.k,o.deltaDays)},null,40,ct),[[U,o.deltaDays],[l,{regex:"[0-9]*[.,]?[0-9]*"}]])]),dt,i("span",null,[i("b",null,u(o.days-r.getFloat(o.deltaDays)),1)])]),i("td",ut,[i("b",null,u(o.result),1)])]))),128)),i("tr",null,[_t,i("td",yt,[i("span",null,u(r.formatTime(r.totalSeconds)),1),ht,i("span",null,u(r.formatTime(r.totalDeltaSeconds)),1),gt,i("span",null,u(r.formatTime(r.totalSeconds-r.totalDeltaSeconds)),1)]),i("td",pt,[i("span",null,u(r.totalDays),1),mt,i("span",null,u(r.totalDeltaDays),1),ft,i("span",null,u(r.totalDays-r.totalDeltaDays),1)]),Dt])])],2)}var It=g(Qe,[["render",kt],["__scopeId","data-v-ba30b42a"]]);const vt={components:{SettingsYearly:qe,Yearly:It}};function St(e,t,a,n,s,r){const l=v("SettingsYearly"),o=v("Yearly");return c(),d("div",null,[S(l),S(o)])}var wt=g(vt,[["render",St]]);const Ut={components:{TabWeekly:Ye,TabYearly:wt},data(){return{active:0,tabs:[{k:0,name:"\u041D\u0435\u0434\u0435\u043B\u044C\u043A\u0430",content:"TabWeekly"},{k:1,name:"\u0413\u043E\u0434\u0438\u043A",content:"TabYearly"}]}},methods:{changeTab(e){this.active=e}}},At={class:"tabs"},Ct={class:"tabs__tabs"},Tt=["onClick"],bt={class:"tabs__contents"},$t=["onClick"];function Et(e,t,a,n,s,r){return c(),d("div",At,[i("div",Ct,[(c(!0),d(D,null,k(s.tabs,l=>(c(),d("div",{key:l.k,class:p(["tabs__tab",{"is-active":l.k==s.active}]),onClick:o=>r.changeTab(l.k)},u(l.name),11,Tt))),128))]),i("div",bt,[(c(!0),d(D,null,k(s.tabs,l=>(c(),d("div",{key:l.k,class:p(["tabs__content",{"is-active":l.k==s.active}]),onClick:o=>r.changeTab(l.k)},[(c(),q(Q(l.content)))],10,$t))),128))])])}var Lt=g(Ut,[["render",Et],["__scopeId","data-v-259911e2"]]);const xt={name:"App",components:{AppHeader:ie,Tabs:Lt}},Ft={class:"reports"};function Rt(e,t,a,n,s,r){const l=v("AppHeader"),o=v("Tabs");return c(),d("div",Ft,[S(l),S(o)])}var Mt=g(xt,[["render",Rt]]);const[Nt,Ot]=W(),Vt=ue();var Yt=X({state(){return{weeklyApiUrl:localStorage.getItem("weeklyApiUrl")||"",weeklyUserId:localStorage.getItem("weeklyUserId")||"",weeklyDateFrom:Nt,weeklyDateTo:Ot,yearlyApiUrl:localStorage.getItem("yearlyApiUrl")||"",yearlyUserId:localStorage.getItem("yearlyUserId")||"",yearlyDate:Vt,yearlyDeltaDays:JSON.parse(localStorage.getItem("yearlyDeltaDays"))||{},yearlyDeltaSeconds:JSON.parse(localStorage.getItem("yearlyDeltaSeconds"))||{}}},mutations:{weeklyApiChange(e,t){e.weeklyApiUrl=t.weeklyApiUrl,localStorage.setItem("weeklyApiUrl",t.weeklyApiUrl)},weeklyUserChange(e,t){e.weeklyUserId=t.weeklyUserId,localStorage.setItem("weeklyUserId",t.weeklyUserId)},weeklyDateChange(e,t){e.weeklyDateFrom=t.weeklyDateFrom,e.weeklyDateTo=t.weeklyDateTo},yearlyApiChange(e,t){e.yearlyApiUrl=t.yearlyApiUrl,localStorage.setItem("yearlyApiUrl",t.yearlyApiUrl)},yearlyUserChange(e,t){e.yearlyUserId=t.yearlyUserId,localStorage.setItem("yearlyUserId",t.yearlyUserId)},yearlyDateChange(e,t){e.yearlyDate=t.yearlyDate,localStorage.setItem("yearlyDate",t.yearlyDate)},yearlyDeltaDaysChange(e,t){e.yearlyDeltaDays=t.yearlyDeltaDays,localStorage.setItem("yearlyDeltaDays",JSON.stringify(t.yearlyDeltaDays))},yearlyDeltaSecondsChange(e,t){e.yearlyDeltaSeconds=t.yearlyDeltaSeconds,localStorage.setItem("yearlyDeltaSeconds",JSON.stringify(t.yearlyDeltaSeconds))}}}),Pt={install:e=>{e.directive("mask",{mounted:(t,a)=>{Z(a.value).mask(t)}})}};ee(Mt).use(Yt).use(Pt).mount("#app");
