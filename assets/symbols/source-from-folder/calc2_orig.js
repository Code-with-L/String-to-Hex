function setfocus() {
	document.calcform.x.focus();
}
function calc() {
	x = document.calcform.x.value;
 	y = calcfunc(x);
 	y = roundresult(y);
 	document.calcform.y.value = y
}
function calc_a() {
	x = document.calcform2.x.value;
 	y = calcfunc_a(x);
 	y = roundresult(y);
 	document.calcform2.y.value = y
}
function calc3() {
	x1 = document.calcform.x.value;
	x2 = document.calcform.x2.value;
 	y = calcfunc(x1,x2);
 	y = roundresult(y);
 	document.calcform.y.value = y;
}
function calc4() {
	a = document.calcform.x.value;
	b = document.calcform.x2.value;
	c = document.calcform.x3.value;
	d = b*b-4*a*c;
 	document.calcform.y0.value = roundresult(d);
 	if( d>=0 )
 	{
	 	document.calcform.y1.value = roundresult((-b+Math.sqrt(d))/(2*a));
	 	document.calcform.y2.value = roundresult((-b-Math.sqrt(d))/(2*a));
 	}
 	else
 	{
 		re = roundresult(-b/(2*a));
 		im = roundresult(Math.sqrt(-d)/(2*a));
	 	document.calcform.y1.value = re+' + i'+im;
	 	document.calcform.y2.value = re+' - i'+im;
 	}
 	b=-b;
 	document.calcform.y3.value = '('+b.toString()+' \xb1 \u221A('+d.toString()+')) / (2\xd7'+a.toString()+')';
}
function calc5() {
	x = document.calcform.x.value;
 	y = calcfunc(x);
 	y = roundresult(y);
 	if( x>0 ) y='\u00B1'+y;
 	document.calcform.y.value = y
}
function calc6() {
	x1 = document.calcform.x.value;
	x2 = document.calcform.x2.value;
	val=x2;
	if( x2<0 ) val=-val;
 	y = calcfunc(x1,val);
 	y = roundresult(y);
 	if( x2>0 && (x1/2)==Math.round(x1/2) ) y='\u00B1'+y;
 	if( x2<0 ) {
 		if( (x1/2)==Math.round(x1/2) )
 			y='NaN';
 		else
 			y=-y;
 	}
 	document.calcform.y.value = y;
}
/*
function str2num(s)
{
   // fraction: replace (1 1/2) with (1+1/2)
   // replace comma not followed by comma with period
   // remove comma,space,middot
   // remove non math chars
   if( rtcs!=1931 && rtcs!=969 ) return s;
   s=s.toString().trim().replace(/(\d)(\s+)(?=\d)/gm,"$1+").replace(/\u002C/g,'\u002E').replace(/[\u0027\u002C\s]/g,'').replace(/[^-()e\d/*\u00D7\u00F7+.%^!&|isqrt]/g,'').replace("\u00D7","*").replace("\u00F7","/");
   if( s=='' ) return 0;
   return Function('"use strict";return ('+s+')')();
}
*/
// iscalc: 0-not for big numbers 1-for big numbers.
// ds=".": "1,234,567.89", "1 234 567.89", "1/2", "1 1/2"
// ds=",": "1.234.567,89", "1 234 567,89",  "1/2", "1 1/2", "1234567.89" (android keyboard)
// 1 . 0 ,>> nothing
// 1 , 0 .>> ",">"."
// >1 . 0 ,>> replace with ""
// >1 , 0 .>> replace with ""
// . | , >> ".">"" ",">"."
// , | . >> ",">""
//function str2num(s,iscalc=1)
function str2num(s,iscalc)
{
   // set default value
   if( iscalc===undefined ) iscalc=1;
   // check cs
   if( rtcs!=1931 && rtcs!=969 ) return s;
   // get decimal separator/thousand separator
   var ds=(1.1).toLocaleString().substring(1,2);
   var ts=(1000).toLocaleString().substring(1,2);
   // !!!TEMP!!!
   //ds=","; ts=".";
   //s=s.toString().trim().replace(/(\d)(\s+)(?=\d)/gm,"$1+").replace(/\u002C/g,'\u002E').replace(/[\u0027\u002C\s]/g,'').replace(/[^-()e\d/*\u00D7\u00F7+.%^!&|isqrt]/g,'').replace("\u00D7","*").replace("\u00F7","/");
   s=s.toString().trim();
   s=s.replace(/[^\d\s\.\,\-\+\*\/e]/g, '');
   if( s.indexOf(" ")!=-1 && s.indexOf("/")!=-1 )
      // replace 1 1/2 with 1+1/2
      s=s.replace(/(\d)(\s+)(?=\d)/gm,"$1+");

   // remove spaces
   s=s.replace(/\s/g,'');
   if( ds=="," ) {
      // get # of dots and # of commas
      var nd=(s.match(/\u002E/g)||[]).length;
      var nc=(s.match(/\u002C/g)||[]).length;
      if( nd==0 ) {
         if( nc==1 ) s=s.replace(/\u002C/g,'\u002E');
         if( nc>1 ) s=s.replace(/\u002C/g,'');
      }
      if( nc==0 ) {
         if( nd>1 ) s=s.replace(/\u002E/g,'');
      }
      if( nd>0 && nc>0 ) {
         var id=s.indexOf("\u002E");
         var ic=s.indexOf("\u002C");
         if( id<ic )
            s=s.replace(/\u002E/g,'').replace(/\u002C/g,'\u002E');
         else
            s=s.replace(/\u002C/g,'');
      }
   }
   else {
      s=s.replace(/\u002C/g,'');
   }
   // replace x,÷ with *,/
   s=s.replace("\u00D7","*").replace("\u00F7","/");
   if( s=='' ) return 0;
   //console.log(s);
   if( iscalc )
      // Eval expression (not for big numbers)
      return Function('"use strict";return ('+s+')')();
   return s;
}
// for math.js/bignumbers without eval
function str2num2(s)
{
   if( rtcs!=1931 && rtcs!=969 ) return s;
   //s=s.toString().trim().replace(/(\d)(\s+)(?=\d)/gm,"$1+").replace(/,(?=[^,]*$)/,'.').replace(/[’,\s]/g,'').replace(/[^-()e\d/*+.]/g, '');
   //s=s.toString().trim().replace(/(\d)(\s+)(?=\d)/gm,"$1+").replace(/\u002C/g,'\u002E').replace(/[\u0027\u002C\s]/g,'').replace(/[^-()e\d/*\u00D7\u00F7+.%^!&|isqrt]/g,'').replace("\u00D7","*").replace("\u00F7","/");
   s=s.toString().trim().replace(/(\d)(\s+)(?=\d)/gm,"$1+").replace(/\u002C/g,'\u002E').replace(/[\u0027\u002C\s]/g,'').replace("\u00D7","*").replace("\u00F7","/");
   return s;
}
// for percenatge calcualtor
function str2num4(s)
{
   s=s.replace(/\u002C/g,'\u002E');
   return s;
}
// num-number nd-decimal digits number
//function num2str(num,fdmin,fdmax)
function num2str(s,nd)
{
   //!!!if( arguments.length==1 )
   if( typeof nd==='undefined' )
      var nd=-1;
   s=s.toString();
   if( rtcs!=1931 && rtcs!=969 ) return s;
   if( s.indexOf('e')!=-1 ) {
      var ds=(1.1).toLocaleString().substring(1,2);
      s=s.replace('\u002E',ds);
      return s;
   }
   s=s.replace("−","-"); // bug with sl-SL locale
   s=s.substring(s.indexOf("-")); // bug with he locale
   s=Number(s);
   var min=(nd<0)?0:nd;
   var max=(nd<0)?20:nd;
   s=s.toLocaleString(undefined,{minimumFractionDigits:min,maximumFractionDigits:max});
   s=s.trim().replace(/\u00D7/g,'');
   return s;
}
// for math.js
function num2str2(s)
{
   var isi=s.toString().indexOf('i');
   if( isi!=-1 ) return s;
   var ds=(1.1).toLocaleString().substring(1,2);
   var ts=(1000).toLocaleString().substring(1,2);
   //s=s.replace(".",ds);
   s=s.toString().replace('\u002E',ds);
   if( s.indexOf('e')!=-1 ) return s;
   var ids=s.indexOf(ds);
   if( ids==-1 ) ids=s.length;
   if( ids>3 )
   for(var i=ids-3; i>0; i-=3)
      s=s.slice(0,i)+ts+s.slice(i);
   return s;
}
function num2str3(s)
{
   var d=(1.1).toLocaleString().substring(1,2);
   //var nd=(d=='\u002E')?'\u002C':'\u002E';
   //if( d=='\u002E'||d=='\u002C' )
   //   s=s.toString().replace(nd,d);
   if( d=='\u002C' ) s=s.toString().replace(/\u002E/g,d);
   return s;
}
// for url params with space that was converted to plus
function decodeURIComponent2(x)
{
   return decodeURIComponent(x.replace(/\+/g,' '));
}
var rtcs;
window.addEventListener("DOMContentLoaded",function() {
   inputnum2txt();
   setDoc();
   rtcs=getcs();
});
// convert desktop input number to input text
function inputnum2txt()
{
   if((window.innerWidth<800) || (typeof n2tskip!=='undefined')) return;
   var o=document.querySelectorAll('input[type=number]');
   for(var i=0; i<o.length; i++) {
      o[i].type="text";
      o[i].removeAttribute("min");
      o[i].removeAttribute("max");
      o[i].removeAttribute("step");
   }
}
// page replace decimal point with commas
function setDoc()
{
   var d=(1.1).toLocaleString().substring(1,2);
   if( d=='\u002E' ) return;
   //document.body.innerHTML=document.body.innerHTML.replace(/\d\.\d/g, function(s) {
   //   return s.replace(/\./g, d);
   //});
   var docdiv=document.getElementById("doc");
   //var nodes=docdiv.querySelectorAll("h1,p,td,a");
   //inch-to-cm.html not working with *
   //celsius-to-fahrenheit not working with td because form has table
   //a will change link urls too!!!
   var nodes=docdiv.querySelectorAll("h1,p,.ntable td");
   for(var i=0; i<nodes.length; i++){
      if( nodes[i].nodeType===Node.ELEMENT_NODE )
         nodes[i].innerHTML=nodes[i].innerHTML.replace(/\d\.\d/g, function(s) {
            return s.replace(/\./g, d);
         });
   };
}
// get checksum of hostname
function getcs()
{
   var s=0;
   for(var i=0,l=location.hostname; i<l.length; i++) {s+=l.charCodeAt(i);}
   return s;
}
function roundresult(x) {
 	y = parseFloat(x);
 	y = roundnum(y,10);
 	return y;
}
function roundnum(x,p) {
	var i;
 	var n=parseFloat(x);
	//var m=n.toPrecision(p+1);
	var m=n.toFixed(p);
	var y=String(m);
	i=y.indexOf('e');
	if( i==-1 )	i=y.length;
	j=y.indexOf('.');
	if( i>j && j!=-1 )
	{
		while(i>0)
		{
			if(y.charAt(--i)=='0')
				y = removeAt(y,i);
			else
				break;
		}
		if(y.charAt(i)=='.')
			y = removeAt(y,i);
	}
	return y;
}
function roundnum2(x,p) {
	var i;
 	var n=parseFloat(x);
	var m=n.toFixed(p);
	var y=String(m);
	i=y.length;
	j=y.indexOf('.');
	if( i>j && j!=-1 ) 
	{
		while(i>0)
		{
			if(y.charAt(--i)=='0')
				y = removeAt(y,i);
			else
				break;
		}
		if(y.charAt(i)=='.')
			y = removeAt(y,i);
	}
	return y;
}
function removeAt(s,i) {
	s = s.substring(0,i)+s.substring(i+1,s.length);
	return s;
}
var gcd = function(a, b) {
    if ( ! b) {
        return a;
    }
    return gcd(b, a % b);
};
