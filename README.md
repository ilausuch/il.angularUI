# il.angularUI

Collection of user interface elements.

# ilInput

Featured angular inputs. 

This is the list of input types: text (by default), password, boolean, date, time, dateTime, select, autocomplete.

## General configuration

### model and field

These attributes are required and represent the model of input. Model defines the object and field defines the attribute in model 

```html
<script>
	...
	$scope.data={
		name:"Hello world"	
	}
	...
</script>
<il-input model="data" field="'name'"></il-input>
```

### label

Add a label over the input field

```html
<il-input model="data" field="'name'" label="'Name'"></il-input>
```

### placeholder

Set placeholder when input is empty

```html
<il-input model="data" field="'name'" label="'Name'" placeholder="'Enter your name'"></il-input>
```


### Required control

* **required**: Declare if field is required. It has effects over required label and verification functions
* **required-visible**: Declare if required label is visible. By default is a red '*' after label
* **required-label**: The required label text

```html
<il-input model="data" field="'name'" label="'Name'" required="true" required-label="'(* required)'"></il-input>
```


### Inner labels and icons 
* **inner-label** allows to add a text inside input. 

```html
<il-input model="data" field="'name'" label="'Name'" inner-label="'My name'"></il-input>
```

* **inner-icon** allows to add a bootstrap icon. For instance to use bootstrap user icon 'glyphicon glyphicon-user'
```html
<il-input model="data" field="'name'" label="'Name'" inner-icon="'user'"></il-input>
```

* **inner-awesome-icon** allows to add a bootstrap icon. For instance to use bootstrap user icon 'fa fa-user'. You must include awesomeFonts
```html
<il-input model="data" field="'name'" label="'Name'" inner-awesome-icon="'user'"></il-input>
```


### Verifications
* **verify-show**: Shows color border and right-top icon according to the status. By default is true.
* **verify-fnc**: Define a function to verify the content of the field
* **verify-group**: Declare the Verification Group. See bellow
* **verify-if-void**: Define if verfy fnc is called when field is empty. By default is false

```html
<il-input model="data" field="'age'" verfy-fnc="verifyAge(model,value)" verify-if-void="true"></il-input>
```
```js
function verifyAge(model,value){
	return value!=undefined //Value is valid
	&& parseInt(value)==value //Is an integer
	&& value>0; //Is positive
}
```
#### Events
* **on-verify**: this is an event called when verification status has changed

```html
<il-input model="data" field="'age'" verfy-fnc="verifyAge(model,value)" verify-if-void="true" on-verify="onVerify(valid,model,value)"></il-input>
```
```js
function onVerify(valid,model,value){
	console.debug("Age is",valid);
}
```
#### Verifications already deffined.
* **text-verify-int**: Integer value verification
* **text-verify-float**: Float value verification

### Change value events
* **on-change** : event called when input value has changed.
* **on-change-only-when-validate**: event called when input value has changed and is valid

```html
<il-input model="data" field="'name'" on-change="nameChanged(model,value)"></il-input>
```
```js
function nameChanged(model,value){
	console.debug("Name changed to",value);
}
```

### Others
* **hide-border**: If true border are hidden, by default is false.

## password
It's similar to text type, but uses '*' instead of characters.

```html
<il-input type="'password'" model="data" field="'password'"></il-input>
```

## textarea
Its similar to text type, but with more rows

* **text-rows**: Number of rows to view. By default 5

```html
<il-input type="'textarea'" model="data" field="'password'"></il-input>
```

## select

* **select-options**: Array variable with options
* **select-label-field**: Field used to print the label
* **select-value-field**: Define what field is used to fill model field. It's optional, if it isn't specified all object is put in field

```html
<script>
	list=[
		{name:"English",code:"en"},
		{name:"Spanish",code:"es"}
	]
</script>

<il-input 
	type="'select'"
	model="data" field="'lang'" 
	label="'Select a language'"
	select-options="list" 
	select-label-field="'label'" 
	select-value-field="'code'" ></il-input>
```

Use functions to create complex labels and values. You can access to item and model values.

* **select-label-fnc**: Function to print the label
* **select-value-fnc**: Define a function used to fill model field. 

```html
<il-input 
	type="'select'"
	model="data" field="'lang'" 
	label="'Select a language'"
	select-options="list" 
	select-label-fnc="item.label (item.code)" 
	select-value-field="'code'" ></il-input>
```

## autocomplete
It's similar to select but you must write to view match options.

```html
<il-input 
	type="'autocomplete'"
	model="data" field="'country'" 
	label="'Select a country'"
	select-options="list" 
	select-label-field="'label'"></il-input>
```

**autocomplete-search-method** allows to control match method used in search. Options: (by default is normal)

* **normal** or **allWords**: all input text words must match with label text in any position
* **anyPosition**: all input text must match with label text in any position
* **startWith**: all input text must match with the start of label text
* **anyWord**: any of the words in input text must match with label text parts.

 
## date and time types

There are tree types of date/time calendars:

* **date**: Select a date
* **time**: Select a time (24 hours)
* **dateTime**: Select a date and time (24 hours)

Date options:
 
* **date-show-year-combo**: Year can be selected directly with selector
* **date-min-year**: Min year can be selected
* **date-max-year**: Max year can be selected
* **date-can-change-month**: Can change months using arrows.
* **date-available-dates**: Define a list of selectable dates. Others aren't. It's optional, if isn't defined all dates are selectable. 
* **date-select-only-available-dates**: Controls if user can select dates ins't in available dates list (works only with **date-available-dates**)
* **date-fix-modal**: Date calendar selector is always opened.
* **date-locale**: Define locale information (be careful, modifies moment.js locale and it's global!).
* **date-start-at**: Moment value that defines month and year calendar witch start 
```html
<il-input
	model="date"
	field="'date'"
	type="'date'"
	label="'Select a date'"
	inner-awesome-icon="'calendar'"
	date-show-year-combo="true"
>	
</il-input>
```

**date-available-dates** is an array that defines what dates can be selected. If isn't defined all dates are selectable. This array can contain two types of elements. Single dates and ranges. Use moment.js to define dates

```js
dates=[
	moment(), //Today
	moment().add(1,'days'),	//Tomorrow
	[
		moment().add(5,'days'), //Since in 5 days
		moment().add(10,'days') //To 10 days after
	]
```

Time options:

* **time-seconds**: Define if seconds can be fixed. By default is false

```html
<il-input
	model="data"
	field="'date'"
	type="'time'"
	label="'Time'"
	inner-awesome-icon="'clock-o'"
	time-seconds="true"
>	
</il-input>
```

Other options

* **z**: z-index value for modals
* **modal-on-top**: Define if modal is always in top

## checkbox
Define a checkbox selector with one or more options to select.

* **checkboxMax**: How may items can be selected
* **checkboxMin**: Min items selected to verify 

```html
<script>
	list=[
		{name:"Cat"},
		{name:"Dog"},
		{name:"Bird"},
		{name:"Mouse"},
	]
</script>
<il-input
	model="data"
	field="'checkbox'"
	type="'checkbox'"
	select-options="list"
	select-label-field="'name'"
	label="'Select your pet'"
	checkbox-max="2"
	checkbox-min="1"
	description="'You can select two max'"
></il-input>
```

## boolean
Define a boolean selector where true and false are html's

* **booleanTrue**: True value, by default is 'true'
* **booleanFalse**: False value, by default is 'false'
* **booleanTrueHtml**: True html renderer
* **booleanFalseHtml**: False html renderer

```html
<il-input
	model="data"
	field="'myBoolean'"
	type="'boolean'"
	label="'Do you like coffie?'"
	boolean-true-html="'<span class=\'label label-success\'>Yes, of course</span>'"
	boolean-false-html="'<span class=\'label label-danger\'>No!</span>'"
	verify-show="false"
	hide-border="true"
	>	
</il-input>
```

# ilTable

You can search, order, select, use pagination, advanced renderers, inline edition, show template-html for details bellow each row, row actions, and modify footer template.

Basics attributes:

* **model**: List of items to show
* **columns**: List of columns

## Column definition
There are several types of columns you can use. All columns have common attributes:

* **title**: Title of column
* **field**: Field in model
* **Required**: If is required (if you are editing)

This example is a **text** column:
```html
{
	title:"Name",
	field:"name",
	required:true
}
```


###textarea
It's similar to text but with more space. Activated with **type="textarea"**
```html
{
	title:"Name",
	field:"name",
	type:"textarea",
	required:true
}
```

###boolean
Is a column with two possibles values and is showed using a template. Activated with **type="boolean"**

To control boolean you must create an **options** object:

* **true_value**: True value will be stored in model field
* **false_value**: False value will be stored in model field
* * **true_html**: True HTML visualization, can has any html element like images
* **false_html**: False HTML visualization.

```html
{
	title:"It's active",
	field:"active",
	type:"boolean",
	options:{
		true_value:true,
		false_value:false,
		true_html:"Yes!",
		false_html:"No",
	}
},
```

###select and autocomplete
It's showed like **text** column, but when edit it is a combobox. Inside **options**, you must declare the **list** of items. Each item will has a **label** and **value** attributes. Label is what is showed and value what will be stored in field.

If you use **autocomplete** type the combobox is replaced by input text with autocomplete. 

```html
{
	type:"select",
	title:"Status",
	field:"status",
	options:{
		list:[
			{label:"pendent",value:0},
			{label:"confirmed",value:1},
			{label:"deleted",value:2},
		]
	}
},
```

###select-object and autocomplete-object
It's similar to select or autocomplete, but in model field is stored selected object (not only value).  You can define the label **field** for the selector.

```html
{
	type:"select",
	title:"Status",
	field:"status",
	options:{
		list:[
			{name:"Ivan",id:0},
			{name:"Jose",id:1},
			{name:"Juan",id:2},
		],
		field:"name"
	}
},
```

###dates
Show and allows to select a date.

```html
{
	title:"Birth date",
	field:"date",
	type:"date"
},
```

###html
Shows the html inside a model field. It's not editable.
```html
{
	type:"html",
	title:"HTML",
	field:"description"
},
```
###template
Shows a template usign external html file. It's not editable. 
You can use **item** to use item items.

```html
{
	"type":"template",
	"title":"Template",
	"options":{
		"url":"template.html"
	}
},
```

###func
Shows a text created by function. It's not editable. You can use **item** fields to compound the text.

```html
{
	title:"Full name",
	type:"func",
	func:function(item){
		return item.name+" "+item.lastname;
	}
},
```

## Table and row options
### Search

* **search**: boolean value. Shows search input field

### Pagination

* **items-per-page**: Number of items in each page
* **items-per-page-options**: Array of number of items per page options

```html
<table il-table
	model="items" columns="columns"
	items-per-page="5" items-per-page-options="[5,20,50]">
</table>
```

### On click an item
**on-click-item** capture item click. The item clicked is ''item'' 

```html
<script>
$scope.onClick=function(item){
	console.debug("Item clicked",item);
}
</script>

<table il-table
	model="items" columns="columns"
	on-click-item="onClick(item)">
</table>
```

### Select
 * **select**: Boolean that indicates if rows are selectable
 * **select-multiple**: Boolean that indicates if multiple rows can be selected
 * **on-select**: Event triggered when the selection has changed. The list is ''items''
 
```html
<script>
$scope.onSelect=function(items){
	console.debug("Items selected",items);
}
</script>

<table il-table
	model="items" columns="columns"
	select="true" 
	on-select="onSelect(items)" 
	select-multiple="true">
</table>
```
 
 
### Inline edit
To active editable mode use **editable="true"**. To edit a row user can use the pencil icon in last column or **click-to-edit** can be activated.

* **editable**: boolean to active editable mode
* **click-to-edit**: boolean to active edit mode clicking the target row
* **autoupdate**: boolean that updates model directly
* **on-autoupdate**: callback used to send modified registry to API
* **autoupdate-prompt**: boolean to ask to user if it's do the autoupdate process. If user says no, autoupdate process is cancelled.
* **text-save-confirm**: Text when a changed has occurred.

```html
<script>
$scope.onSave=function(item){
	//Call API to save item
}
</script>

<table il-table
	model="items" columns="columns"
	editable="true" click-to-edit="true"
	autoupdate="true" 
	on-autoupdate="onSave(item)" 
	autoupdate-prompt="true"
	text-save-confirm="'Do you whant store this?'">
</table>
```

	        
### Delete
Activating **delete** the delete icon is visible in last column.

* **delete**: boolean to show delete button
* **on-delete**: Event when a item is deleted. Used to call API
* **text-delete-confirm**: Text to ask to user before delete.

```html
<script>
$scope.onDelete=function(item){
	//Call API to delete item
}
</script>

<table il-table
	model="items" columns="columns"
	delete="true"
	on-delete="onDelete(item)"
	text-delete-confirm="'Are you sure?'">
</table>
```

### Row actions & buttons
Additional to delete and edit buttons in last column, you can add more action icon buttons. 

* **extra-buttons** is an array of extra buttons will be added.
* **on-extra-buttons** if a event triggered when a button is clicked.

Button definition:

* **class**: List of CSS classes of button. Button class list already include glyphicon

```html
<script>
$scope.buttons=[
	{
	class:"glyphicon-send",
	id:"send"
	}
];
$scope.onExtra=function(item,button){
	if (button.id=="send"){
		//Do something
	}
}
</script>

<table il-table
	model="items" columns="columns"
	extra-buttons="buttons"
	on-extra-buttons="onExtra(item,button)">
</table>
```

### Expanding rows
A row can be expanded with additional information. If **expand** is activated a arrow is visible in the first column and when user click it an area below of this row appears. This area is controlled by a HTML template. 

* **expand**: boolean to control expand mode
* **expand-template**: defines the template to show. To access to expanded row use **item** variable. This template can access to $scope and all global variables. 
* **on-expand**: callback function that allow load information from API or prepare data when a row is expanded.

template.html
```html
<div>
Hello {{item.name}} this is a template example.
</div>
```

Code:
```html
<script>
$scope.onExpand=function(item){
	//Do something
}
</script>

<table il-table
	model="items" columns="columns"
	expand="true"
	expand-template="'template.html'"
	on-expand="onExpand(item)">
</table>
```


### Footer control

* **footer** boolean to make visible the footer.
* **extra-footer-template** define a template that will be visible in footer.

footer.html
```html
<div>
This is an additional footer with a button
<button class="btn btn-primary">Export to excel</button>
</div>
```

Code:
```html
<table il-table
	model="items" columns="columns"
	footer="true"
	extra-footer-template="'footer.html'">
</table>
```


# ilAdvancedCombo
Is a selector that opens a combobox with a searchable table (ilTable)

Attributes:

* **title**: Title of modal
* **columns**: Column array (see ilTable configuration)
* **list**: Selectable item list
* **model** & **field**: Object and field where value is stored (see ilInput)
* **labelField**: Field to show in input when some item is selected.
* **itemsPerPage**: Items per page on table
* **modal-size**: Size of modal (see ilModal)
* **can-delete**: If true buttons with icon trash appears to delete the selection
* **z**: z-index of modal (see ilModal)
* **top**: Top position of modal, by default 0 (see ilModal)

Events:

* **onChange**: On change event is triggered when selected item is changed.

```html
<script>
//Columns
columns=[
	{title:"Name",field:"name"},
	{title:"Lastname",field:"lastname"},
	{
		title:"Complete name",
		type:"func",
		func:function(item){
			return item.name+" "+item.lastname;
		}
	}

//Create random items
items=[];
for (var i=0; i<100; i++)
	this.items.push({name:"name "+i,lastname:"lastname "+i});

//You must create data object
data={}

function onChange(item){
	console.debug("Selected item",item);
}
</script>

<il-advanced-combo
	title="'Users'"
	columns="columns"
	list="items"
	model="data"
	field="'user'"
	label-field="'name'"
	modal-size="'80%'"
	top="'100px'"
	on-change="onChange(item)"
>
</il-advanced-combo>
```

# ilDetail

# ilModal
# ilWeek
# ilYearCalendar
# ilUpload
Allows upload files using different cloud uploaders, such as [filepicker](https://www.filepicker.com/)

## Options

* **model**: Object model
* **field**: Field in object model
* **system**: Upload system to use (see below)
* **multiple**: Boolean to control if allows multiple files
* **on-change**: Event to capture when file list has changed
* **user-fields**: Allows to create more input columns, such as, descriptions, checkboxes o selects
* **slim**: Active slim mode, uploader controls are minimal. Only for one single file and without user-files

The result is an array of file objects with these attributes:

* **filename**: Original user filename
* **mimetype**
* **size** (in bytes)
* **url**: Complete url
* **user_(field name)**: user fields values


## Complete example usign filepicker

```html
<script>
$scope.model={files:[]}
$scope.uploadSystem=new ilUpload_FilePiker("<INSERT HERE YOUR APIKEY>",
		{//Here you can specify any filepicker option
			mimetype: 'image/*',
			services: [
				'COMPUTER', 
				'FACEBOOK', 
				'CLOUDAPP'
				]
		});
	
$scope.onChange=function(list){
	console.debug("Uploader has changed",list);
}
</script>

<il-upload model="model" field="'files'" system="uploadSystem" multiple="true" on-change="onChange(list)"></il-upload>
```

## Usign user fields

User fields allow to user to increase the information of files. To prepare it you must create an array of objects to describe these fields. All fields has these attributes:

* **id**: Identification name to access in file list
* **label**: Column label
* **Type**: Type of field. There are 3 types:
	* **text**
	* **checkbox**
	* **combobox**: In this case you must specify options in field options with objects with label and value attributes. (see example)

```html
<script>
$scope.fields=[
		{
			id:"documentType",
			label:"Document type",
			type:"combobox",
			options:[
				{label:"Photo",value:"photo"},
				{label:"Passport",value:"passport"},
			]
		},
		{
			id:"info",
			label:"Aditional info",
			type:"text",
		},
		{
			id:"verified",
			label:"Verified",
			type:"checkbox",
		}]
</script>

<il-upload model="model" field="'files'" system="uploadSystem" multiple="true" user-fields="mc.fields"></il-upload>

```

## Initial files
To initialize ilUpload with files your model with an array of files with the same format

```js
$scope.model={
	files:[{
		filename:"image.png",
		mimetype:"image/png",
		size:29106,
		url:"<MY URL>",
		}]
	}
```


## Creating your own system

A cloud upload system is created like a function with secret and config parameters. 

This function must have a method name pick with two parameters successCallback  and errorCallback. successCallback must return the list of files with format. errorCallback must return a string with error detail.

```js
function ilUpload_FilePiker(secret,config){
	this.secret=secret;
	
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
}

```

# ilSurvey



# Use in forms

