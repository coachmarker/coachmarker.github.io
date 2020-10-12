/*
filedrag.js - HTML5 File Drag & Drop demonstration
Featured on SitePoint.com
Developed by Craig Buckler (@craigbuckler) of OptimalWorks.net
*/
var canvas = this.__canvas = new fabric.Canvas('c', {
	preserveObjectStacking: true,
	enableRetinaScaling: false,
	imageSmoothingEnabled: false
  });
  var refRect;
var rect, isDown, origX, origY, hintType, shapeType=1; 
var isCreateMode=false;
var hintColor=['#007bff','#6c757d','#28a745','#dc3545', '#ac1511', '#17a2b8', '#343a40','#212529','#343a40','#6c757d','#28a745','#007bff'];
var outputjson =  {"packageName":0, "filename":0,"mask":[]};
var hintIndex;
var sharpCount=0;
var clickable=false;
var bgImg;
function setHintType(e){
	hintIndex=e;
	hintType=hintColor[e];
	isCreateMode=true;
	
}
function printJson(){
	$("#outputjson").text( JSON.stringify(outputjson,null,4)); 
}
function setPackageName(str){
	outputjson["packageName"]=str;
	printJson()
}

	function getExtension(filename) {
		var parts = filename.split('.');
		return parts[parts.length - 1];
	  }
	  
	  function isImage(filename) {
		var ext = getExtension(filename);
		switch (ext.toLowerCase()) {
		  case 'jpg':
		  case 'gif':
		  case 'bmp':
		  case 'png':
			//etc
			return true;
		}
		return false;
	  }
	  
	  function isVideo(filename) {
		var ext = getExtension(filename);
		switch (ext.toLowerCase()) {
		  case 'm4v':
		  case 'avi':
		  case 'mpg':
		  case 'mp4':
			// etc
			return true;
		}
		return false;
	  }

	  var rad = document.uploadform.maskShapeOptions;
	  for (var i = 0; i < rad.length; i++) {
		  rad[i].addEventListener('change', function() {
			shapeType=parseInt(this.value);
			console.log("Shape changed to "+shapeType);
		  });
	  }
	  var rad2 = document.uploadform.clickable;
	  for (var i = 0; i < rad2.length; i++) {
		rad2[i].addEventListener('change', function() {
			clickable=parseInt(this.value);
			refRect=canvas.getActiveObject();
			if(refRect!=null){
				outputjson.mask[refRect.id]["clickable"]=clickable;
			}
			console.log("clickable changed to "+clickable);
		  });
	  }
	var vgtext= document.uploadform.vgtext;
	vgtext.addEventListener('change', function() { 
		refRect=canvas.getActiveObject();
		if(refRect!=null && outputjson.mask[refRect.id]["hintIndex"]>=1 &&  outputjson.mask[refRect.id]["hintIndex"]<=4){
			outputjson.mask[refRect.id]["text"]=this.value; 
			var tlength=this.value.split(" ").length
			outputjson.mask[refRect.id]["textlength"]=tlength;
		}
		console.log("text changed to "+this.value);
	  });

	canvas.on('mouse:down', function(o){
		if(!isDown && isCreateMode){  
			isDown = true;
			isCreateMode=false;
			var pointer = canvas.getPointer(o.e);
			origX = pointer.x;
			origY = pointer.y;
			switch(shapeType) {
				case 0:
					rect = new fabric.Ellipse({  
						rx: pointer.x - origX,
						ry: pointer.y - origY
					});
				  break;
				case 1:
					rect = new fabric.Rect({  
						width: pointer.x-origX,
						height: pointer.y-origY
					});
				  break; 
			  }
			rect.objectCaching= false;
			rect.selectable=true; 
			rect.left=origX; rect.top=origY;
			rect.originX= 'left'; rect.originY='top'; 
			rect.angle=0; rect.fill=hintType;
			rect.id=sharpCount;
			sharpCount++;
			rect.on('selected', function() {
				isCreateMode=false;
				console.log('selected a rectangle');
			});
			//canvas.add(rect);
			//canvas.setActiveObject(rect);
			refRect=rect;
		}  
		canvas.renderAll();
	});
	
	canvas.on('mouse:move', function(o){ 
		if (!isDown) return;
		var pointer = canvas.getPointer(o.e);
	
		if(origX>pointer.x){
			rect.set({ left: Math.abs(pointer.x) });
		}
		if(origY>pointer.y){
			rect.set({ top: Math.abs(pointer.y) });
		}
		switch(shapeType) {
			case 0:
				rect.set({ rx: Math.abs(origX - pointer.x) });
				rect.set({ ry: Math.abs(origY - pointer.y) }); 
			break;
			case 1:
				rect.set({ width: Math.abs(origX - pointer.x) });
				rect.set({ height: Math.abs(origY - pointer.y) });
			break; 
		}  
		canvas.renderAll();
	});
	canvas.on("selection:created", function(obj){ 

	});
	canvas.on("selection:updated", function(obj){ 
	});
	canvas.on('mouse:up', function(o){
		var widthrx=0;
		var heightry=0;
		if(isDown){
			isDown = false; 
			canvas.add(refRect);
			if(shapeType==0){
				widthrx=rect.rx;
				heightry=rect.ry;
			}else if(shapeType==1){
				widthrx=rect.width;
				heightry=rect.height;
			}
			var shapejson = {"shapeType":shapeType, "hintIndex":hintIndex, "clickable":clickable, "left":rect.left.toPrecision(5), "top":rect.top.toPrecision(5), "widthrx":widthrx,"heightry": heightry}; 
			outputjson.mask.push(shapejson);
		} else{ 
			refRect=canvas.getActiveObject();
			if(refRect!=null){
				outputjson.mask[refRect.id]["left"]=refRect.left.toPrecision(5);
				outputjson.mask[refRect.id]["top"]=refRect.top.toPrecision(5);
				
				if(outputjson.mask[refRect.id]["shapeType"]==0){
					console.log("circle shapeType: "+outputjson.mask[refRect.id]["shapeType"]+" refRect.rx"+refRect.rx);
					widthrx=refRect.rx * refRect.scaleX;
					heightry=refRect.ry * refRect.scaleX;
				}else if(outputjson.mask[refRect.id]["shapeType"]==1){
					console.log("rect shapeType: "+outputjson.mask[refRect.id]["shapeType"]+" refRect.width "+refRect.width);
					widthrx=refRect.width * refRect.scaleX;
					heightry=refRect.height * refRect.scaleY;;
				}
				outputjson.mask[refRect.id]["widthrx"]=widthrx;
				outputjson.mask[refRect.id]["heightry"]=heightry; 
			} 
		}
		printJson();
	});
	
	// getElementById
	function $id(id) {
		return document.getElementById(id);
	}


	// output information
	function Output(msg) {
		var m = $id("messages");
		m.innerHTML = msg + m.innerHTML;
	}
	
	function downloadObjectAsJson(){
		var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(outputjson, null, 4));
		var downloadAnchorNode = document.createElement('a');
		downloadAnchorNode.setAttribute("href",     dataStr);
		downloadAnchorNode.setAttribute("download", outputjson["filename"] + ".json");
		document.body.appendChild(downloadAnchorNode); // required for firefox
		downloadAnchorNode.click();
		downloadAnchorNode.remove();

	}

	function downloadSvg(){
		canvas.backgroundImage=0;  
		var canvasSVG = canvas.toSVG();
		var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent( );
		var downloadAnchorNode = document.createElement('a');
		downloadAnchorNode.setAttribute("href",     dataStr);
		downloadAnchorNode.setAttribute("download", outputjson["packageName"] + ".svg");
		document.body.appendChild(downloadAnchorNode); // required for firefox
		downloadAnchorNode.click(); 
		downloadAnchorNode.remove();
		canvas.setBackgroundImage(bgImg, canvas.renderAll.bind(canvas));
	}
	// file drag hover
	function FileDragHover(e) {
		e.stopPropagation();
		e.preventDefault();
		e.target.className = (e.type == "dragover" ? "hover" : "");
	} 
	// file selection
	function FileSelectHandler(e) {
		
		// cancel event and hover styling
		FileDragHover(e);

		// fetch FileList object
		var files = e.target.files || e.dataTransfer.files;

		// process all File objects
		for (var i = 0, f; f = files[i]; i++) {
			ParseFile(f);
		}

	} 
	// output file information
	function ParseFile(file) {

		Output(
			"<p>File information: <strong>" + file.name +
			"</strong> type: <strong>" + file.type +
			"</strong> size: <strong>" + file.size +
			"</strong> bytes</p>"
		);
		if(isImage(file.name)){ 
			outputjson["filename"]=file.name;
			var reader = new FileReader();
			reader.onload = function (f) {
			  var data = f.target.result;                    
			  fabric.Image.fromURL(data, function (img) {
				bgImg = img.set({left: 0, top: 0, angle: 00,width:img.width, height:img.height});
				canvas.setBackgroundImage(bgImg, canvas.renderAll.bind(canvas));
				canvas.setWidth(img.width);
				canvas.setHeight(img.height);
			  });
			};
			reader.readAsDataURL(file);  
		}
		
	}


	// initialize
	function Init() {

		var fileselect = $id("fileselect"),
			filedrag = $id("filedrag"),
			submitbutton = $id("submitbutton");

		// file select
		fileselect.addEventListener("change", FileSelectHandler, false);

		// is XHR2 available?
		var xhr = new XMLHttpRequest();
		if (xhr.upload) {

			// file drop
			filedrag.addEventListener("dragover", FileDragHover, false);
			filedrag.addEventListener("dragleave", FileDragHover, false);
			filedrag.addEventListener("drop", FileSelectHandler, false);
			filedrag.style.display = "block";

			// remove submit button
			submitbutton.style.display = "none";
		}

	}

	// call initialization file
	if (window.File && window.FileList && window.FileReader) {
		Init();
	}

	function deleteObjects(){
		var activeObject = canvas.getActiveObject();
		delete outputjson.mask[activeObject.id];
		if (activeObject) {
			if (confirm('Are you sure?')) {
				canvas.remove(activeObject);
			}
		} 
	}
	$("#delete").click(function(){ 
		deleteObjects();
	});
	
