/**
LICENSE MIT 2015 ilausuch@gmail.com	
*/

/*
function ilUpload_CustomDemo(secret){
	this.secret=secret;
	
	this.pick=function(successCallback,errorCallback){
		//On success call to successCallback with an object with (url,filename,mimetype,size)
		//On error call to errorCallback with an error text
	}
}
*/

function ilUpload_FilePiker(secret,config){
	this.secret=secret;
	
	if (secret==undefined || secret==""){
		alert("You must speficy the filepicker secret");
	}
	
	if (config==undefined)
		this.config={};
	else
		this.config=config;
	
	this.pick=function(successCallback,errorCallback){
		filepicker.setKey(this.secret);
		filepicker.pick(config,
			function(Blob){
				successCallback(Blob)
			},
			function(FPError){
				errorCallback("Error uploading file")
			}
		);
	}
	
	//mimetype: 'image/*',
	//services: ['COMPUTER', 'FACEBOOK', 'CLOUDAPP']			
}


function ilUpload_basic(url,config){
	this._isBasic=true,
	this.url=url;
	this.show=false;
	this.uploading=false;
	this.error=false;
	this.percent="0%";
	
	this.pick=function(successCallback,errorCallback){
		
		if (!this.$scope.useBasicUpload)
			alert("You must add ng-file-upload javascript library and il.ui.modal");
			
		this.uploading=false;
		this.error=false;
		this.show=true;
		this.successCallback=successCallback;
		this.errorCallback=errorCallback;
	}
	
	this.upload = function(files) {
		this.uploading=true;
		system=this;
		
		files.forEach(function(file){
			system.Upload.upload({
				url: system.url,
				file: file
			}).then(function(resp) {// file is uploaded successfully
				system.show=false;
				
				resp.data.filename=resp.data.name;
				system.successCallback(resp.data);
				
			}, function(resp) { // handle error
				system.error=true;
				system.uploading=false;
				system.errorCallback("");
			}, function(evt) {// progress notify
				system.percent=""+parseInt(100.0 * evt.loaded / evt.total)+ '%';
			});
		});
	    
	}
}

useBasicUpload=false;
moduleList=['ngSanitize','pascalprecht.translate','ui.bootstrap'];
try { 
	angular.module("ngFileUpload");
	angular.module("il.ui.modal");
	moduleList.push('ngFileUpload'); 
	moduleList.push('il.ui.modal')
	useBasicUpload=true;
} catch(err) {}

angular.module("il.ui.upload", moduleList)
	.directive('ilUpload', function() {
		var controller = ['$scope','$timeout','$attrs'];
		
		if (useBasicUpload)
			controller.push("Upload");
		
		controller.push(function ($scope,$timeout,$attrs,Upload) {
			
			$scope.useBasicUpload=useBasicUpload;
			$scope.system.$scope=$scope;
			$scope.system.Upload=Upload;
			
			$scope.defaultValue=function(varName,value){
				if ($scope[varName]==undefined)
					$scope[varName]=value;
			}
			
			$scope.defaultValue("multiple",false);
			$scope.defaultValue("slim",false);
			$scope.defaultValue("areYouSureMsg","Are you sure?");
			$scope.defaultValue("link",true);
			$scope.defaultValue("forbiddenLinkMsg","");
			$scope.defaultValue("disabled",false);
			$scope.defaultValue("canDelete",true);
			
			
			if ($scope.model!=undefined && !Array.isArray($scope.model[$scope.field]))
				$scope.model[$scope.field]=[];
							
			$scope.getFiles=function(){
				if ($scope.model==undefined)
					return [];
				else
					return $scope.model[$scope.field];
			}
			
			
			$scope.getSize=function(file){
				if (file.size/(1024*1024)>=1)
					return "" + Math.round(100*file.size/(1024*1024))/100 + " Mb.";
				else if (file.size/(1024)>=1)
					return "" + Math.round(file.size/1024) + " Kb.";
				else
					return "" + file.size + " bytes";
			}
			
			$scope.isImage=function(file){
				switch(file.mimetype){
					case "image/png":
					case "image/jpg":
					case "image/jpeg":
					case "image/gif":
						return true;
					break;
					default:
						return false;
				}
			}
			
			$scope.getMimeAwesomeClass=function(file){
				switch($scope.getExtension(file)){
					case "zip":
					case "rar":
					case "tar":
					case "tgz":
						return "fa-file-zip-o";
					break;	
					case "doc":
					case "docx":
						return "fa-file-word-o";
					break;
					case "xls":
					case "xlsx":
						return "fa-file-excel-o";
					break;
					case "txt":
						return "fa-file-text-o";
					break;
					case "pdf":
					case "pdfx":
						return "fa-file-pdf-o"
					break;
					case "mp3":
						return "fa-file-audio-o";
					break;
					case "mp4":
					case "avi":
					case "mov":
					case "mpg":
						return "fa-file-video-o";
					break;
					case "tiff":
					case "bmp":
						return "fa-file-picture-o";
					break;
					default:
						return "fa-file-o";
				}
			}
			
			$scope.getExtension=function(file){
				v=file.filename.split(".")
				return v[v.length-1];
			}
			
			$scope.getMime=function(file){
				switch($scope.getExtension(file)){
					case "zip":
					case "rar":
					case "tar":
					case "tgz":
						return "Compressed file";
					break;	
					case "doc":
					case "docx":
						return "Word";
					break;
					case "xls":
					case "xlsx":
						return "Excel";
					break;
					case "txt":
						return "Text file";
					break;
					case "pdf":
					case "pdfx":
						return "PDF"
					break;
					case "mp3":
						return "audio";
					break;
					case "mp4":
					case "avi":
					case "mov":
					case "mpg":
						return "video";
					break;
					case "tiff":
					case "bmp":
						return "image";
					break;
					default:
						return "file";
				}
			}
			
			
			$scope.pick=function(){
				$scope.system.pick(
					function(file){
						if (!$scope.multiple)
							$scope.model[$scope.field]=[];
							
						$timeout(function(){
							$scope.model[$scope.field].push(file);
							
							if ($scope.onChange!=undefined)
								$scope.onChange({list:$scope.getFiles()});
						})
						
						
					},
					function(errorText){
						if (console) console.debug("Error",errorText);
					}
				);
			}
			
			$scope.removeFile=function(file){
				if (confirm($scope.areYouSureMsg)){
					list=$scope.getFiles();
					for (i=0; i<list.length; i++)
						if (list[i]==file)
							list.splice(i,1);
				
					if ($scope.onChange!=undefined)
						$scope.onChange($scope.getFiles());
				}
			}
			
			$scope.showForbiddenLinkwMsg=function(){
				alert($scope.forbiddenLinkMsg);
			}
		
		});
		
		template='%%TEMPLATE%%';
		
		return {
			restrict: 'E',
			scope: {
				model:'=',
				field:"=",
				system:"=",
				multiple:"=?",
				userFields:"=?",
				slim:"=?",
				onChange:"&",
				errorUploadingFileMsg:"=?",
				retryMsg:"=?",
				dropHereMsg:"=?",
				selectFileMsg:"=?",
				noFilesMsg:"=?",
				uploadingMsg:"=?",
				areYouSureMsg:"=?",
				link:"=?",
				forbiddenLinkMsg:"=?",
				disabled:"=?",
				canDelete:"=?"
			},
			controller: controller,
			template:template
		};
	});