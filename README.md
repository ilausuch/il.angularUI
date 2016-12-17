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
### Description

Description is a text bottom label to detail 
```html
<il-input model="data" field="'name'" label="'Name'" description="'Enter your name'"></il-input>
```

### Placeholder

Placeholder allows show text inside input when it's empty

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
<il-input model="data" field="'name'" label="'Name'" inner-label="'Name'"></il-input>
```

![Text example](https://ilscdn.s3.amazonaws.com/il.angularUI/doc/text.png "Text example")


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
* **
* **: Define if verfy fnc is called when field is empty. By default is false

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
#### Verification groups
You can verify all inputs in a form using verification groups.
First create a 

```js
$scope.verifyGrroup=new ilInputVerificationGroup();
```

To check all items use method check()

```js
if ($scope.verifyGrroup.check())
	//do something
```

In this ejemple, button save only is visible when verification is ok.

```html
<il-input model="data" field="'name'" verify-group="verifyGroup"></il-input>

<il-input model="data" field="'age'" verfy-fnc="verifyAge(model,value)" verify-if-void="true" verify-group="verifyGroup"></il-input>

<button ng-disable="!verifyGroup.check()">Save</button>
```
```js
$scope.verifyGrroup=new ilInputVerificationGroup();

function verifyAge(model,value){
	return value!=undefined //Value is valid
	&& parseInt(value)==value //Is an integer
	&& value>0; //Is positive
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
<il-input type="'textarea'" model="data" field="'largeText'"></il-input>
```

![Textarea example](https://ilscdn.s3.amazonaws.com/il.angularUI/doc/textarea.png "Textarea example")

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


----------


----------


	select-label-field="'label'" 
	select-value-field="'code'" ></il-input>
```

![Select example](https://ilscdn.s3.amazonaws.com/il.angularUI/doc/select.png "Select example")

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
* **date-hide-input**: Hide input field. It must used only with date-fix-modal
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

* **checkbox-max**: How may items can be selected
* **checkbox-min**: Min items selected to verify
* **checkbox-modal**: Boolean, shows the checkbox list of items in a modal, and selected in a list of labels
* **checkbox-modal-z-index**: z-index of checkbox modal
* **checkbox-style** (optional): Style of div container. If you no whant border set checkbox-style="' '"
* **checkbox-modal-close-on-select** (optional, by default false) : closes moda when select one option

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
	checkbox-modal="true"
	description="'You can select two max'"
></il-input>
```

![Checkbox example](https://ilscdn.s3.amazonaws.com/il.angularUI/doc/checkbox.png "Checkbox example")


**Usign modals**

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
	checkbox-max="4"
	checkbox-min="2"
	description="'Max 4, min 2'"
	checkbox-modal="true"
></il-input>
```
![Modal checkbox example](https://ilscdn.s3.amazonaws.com/il.angularUI/doc/checkbox_modal.png "Modal checkbox example")

## boolean
Define a boolean selector where true and false are html's

* **boolean-true**: True value, by default is 'true'
* **boolean-false**: False value, by default is 'false'
* **boolean-true-html**: True html renderer
* **boolean-false-html**: False html renderer

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

## custom
Define a boolean selector where true and false are html's

* **custom-label-fnc**: Funtion that returns text to print. Params are: model,value,field
* **custom-open-callback**: Function call when user click on input field. Params are: model,value,field

```html
<script>
$scope.model={
	name:"John",
}

$scope.customCallback=function(model,value,field){
	model[field]=prompt("Change value",value);
}
</script>

<il-input
	type="'custom'"
	label="'My custom field'"
	model="model"
	field="'name'"
	custom-label-fnc="model[field]"
	custom-open-callback="customCallback(model,value,field)"
></il-input>
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
* **required**: If is required (if you are editing)

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

* **show-pagination** (Optional, by default is true)
* **items-per-page**: Number of items in each page. If this attribute isn't configured, pagination is hidden
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

Allows create modal popups.

* Basic modal: It's the basic transluced modal with title, body and buttons footer
* Message modal: Shows a message. Can use a awessome font icon
* Loading modal: Shows loading message. Can not be closed by user

## Options

### Visibility

* **show** : Variable to control when modal will be visible. Modal controls this variable

### Basic Options

* **title-visible** (optinal, by default true in basic modal): Control title visibility
* **close-visible** (optinal, by default true): Control visibility in title with x icon, only if **titleVisible** is true
* **footer-visible** (optional, by default true): Control footer visibility
* **title** (optional): Title of modal, only if **titleVisible** is true
* **auto-close** (optional, by default true): Modal can close itself when click on cancel button or in x icon
* **cancel-visible** (optinal, by default true): Controls footer cancel button visibility
* **cancel-label** (optinal, by default 'cancel')
* **on-cancel** (optional): Callback when user click footer cancel button
* **success-visible** (optinal, by default true): Controls footer cancel button visibility
* **success-label** (optinal, by default 'save changes')
* **on-success** (optional): Callback when user click footer success button
* **success-disabled** (optional, by default false): Controls success button disabled property

### Advanced Options

* **z** (optional, by default 100): z-index of modal, background uses z-1
* **top** (optional, by default 20px): top margin
* **size** (optional, by default 600px): width of modal

### Message Options & title icons

* **is-message** : true for message modal
* **is-info** (optional, by default false): Show info icon in blue
* **is-alert** (optional, by default false): Show alert icon in red
* **is-question** (optional, by default false): Show question icon in blue
* **is-confirm** (optional, by default false): Show check icon in green
* **custom-icon-class** (optional): Show custom icon using a Awesome font icon class
* **custom-icon-color** (optional): If are using custom-icon-class can change color of icon.

### Loading Options

* **is-loading**: true for loading modal
* **wait-mesage** (optional): wait message text

## Example 1. Basic modal

![ilModal example](https://ilscdn.s3.amazonaws.com/il.angularUI/doc/ilmodal1.png "ilModal example")

```html
<script>
	$scope.text="This is my text";
</script>

<button ng-click="showModal=true"></button>

<il-modal 
	show="showModal" 
	title="'This is my title'"
	on-success="save()"
>
	<input ng-model="text">
	<p>{{text}}</p>
</il-modal>
```

## Example 2. Info

![ilModal example](https://ilscdn.s3.amazonaws.com/il.angularUI/doc/ilModal2.png "ilModal example")

```html
<il-modal 
	show="showModal" 
	is-message=true
	is-info=true
>
	<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi consectetur semper tellus, ac mollis justo facilisis vel. Nullam lobortis placerat turpis, id mattis urna euismod a. Praesent vel velit lacus.</p>
</il-modal>
```

## Example 3. Alert

![ilModal example](https://ilscdn.s3.amazonaws.com/il.angularUI/doc/ilModal3.png "ilModal example")

```html
<il-modal 
	show="showModal" 
	is-message=true
	is-alert=true
>
	<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi consectetur semper tellus, ac mollis justo facilisis vel. Nullam lobortis placerat turpis, id mattis urna euismod a. Praesent vel velit lacus.</p>
</il-modal>
```

## Example 4. Loading

![ilModal example](https://ilscdn.s3.amazonaws.com/il.angularUI/doc/ilModal4.png "ilModal example")

```html
<il-modal 
	show="showModal" 
	is-loading=true
>
</il-modal>
```

## Example 5. Custom icons

![ilModal example](https://ilscdn.s3.amazonaws.com/il.angularUI/doc/ilModal5.png "ilModal example")

```html
<script>
	$scope.text="This is my text";
</script>

<button ng-click="showModal=true"></button>

<il-modal 
	show="showModal" 
	title="'This is my title'"
	on-success="save()"
	custom-icon-class="'fa-bed'"
	custom-icon-color="'magenta'"
>
	<input ng-model="text">
	<p>{{text}}</p>
</il-modal>
```

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

## Basic system
The basic upload system calls to "upload" url with POST method sending a file. You must have a server-side script.

It's simple:

```js
$scope.uploadSystem=new ilUpload_basic("<UPLOAD URL>");
```
It requires

* [ng-file-upload](https://github.com/danialfarid/ng-file-upload) library.
*  ilModal library

Both libraries must preceded to ilUpload.min.js in script list

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

# ilList
It's a sortable list of objects.

![ilList example](https://ilscdn.s3.amazonaws.com/il.angularUI/doc/ilList.png "ilList example")

## Options

* **model**: model as list of objects
* **label-field**: The field that will printed
* **on-click** (optional): Callback to interact when a list item is clicked. Parameters:
	* pos: positión of clicked item
	* item: clicked item 
* **can-sort** (optional, by default false): If user can sort the list
* **can-delete** (optional, by default false): If user can delete an item
* **on-delete** (optional): Callback when user has pushes the delete buton
	*  pos: positión of clicked item
	* item: clicked item 
* **auto-delete** (optional, by default true): Component remove the element automatically
* **delete-confirm** (optional): Message showed to user to confirm the delete operation

## Example

```js
$scope.model=[
	{label:"Cat"},
	{label:"Dog"},
	{label:"Parrot"},
]
```

```html
<il-list
	model="model"
	label-field="'label'"
	can-sort=true
></il-list>
```

# ilSurvey

# ilWeek

# ilYearCalendar

# ilPanel
Draws a bootstrap panel with content

* **title**: Title of panel
* **panel-style** (optional, by default is default): Style of panel (primary, success, info, warning and danger)
* **can-close** (optional, by default is false): Appears a cross on the top-right corner
* **on-close** (mandatory if **can-close** is true): Callback called when user click on cross
* **can-delete** (optional, by default is false): Appears a trash on the top-right corner.
* **on-delete** (mandatory if **can-delete** is true): Callback called when user click on trash
* **can-edit** (optional, by default is false): Appears a pencil on the top-right corner to edit
* **on-edit** (mandatory if **can-edit** is true): Callback called when user click on pencil
* **buttons** (optional): Extra buttons than apears on the top-right

Basic example:
```html
<il-panel title="'My title'" panel-style="'primary'">
This is the content in HTML
</il-panel>
```

## Using buttons
![ilPanel example](https://ilscdn.s3.amazonaws.com/il.angularUI/doc/ilPanel.png "ilPanel example")

```html
<script>
	$scope.onDelete=function(){
	}
	$scope.onEdit=function(){
	}
	$scope.buttons=[
		{
			icon:"cog",
			callback:function(){
				alert("Configuration!");
			}
		}
	]
</script>

<il-panel title="'My panel'" can-delete="true" on-delete="onDelete()" can-edit="true" on-edit="onEdit()" buttons="buttons">
This is the content
</il-panel>

``` 

### Using comands in ng-repeat
If you are using il-panel inside a ng-repeat and you whant to call edit or delete callbacks with current ng-repeat item, see this example:

```html
<script>
	$scope.onDelete=function(item){
	}
	$scope.onEdit=function(item){
	}
	$scope.list=[
		{title:"item1", content:"content1"},
		{title:"item2", content:"content2"},
		
	]
</script>

<il-panel ng-repeat="item in list" 
	title="item.title" 
	can-delete="true" on-delete="onDelete(item)" 
	can-edit="true" on-edit="onEdit(item)"
>
	This is the content: {{item.content}}
</il-panel>

``` 

### Using buttons in ng-repeat

If you are using il-panel inside a ng-repeat and you whant to call edit, delete and button callbacks with current ng-repeat item, see this example:

```html
<script>
	$scope.onDelete=function(item){
	}
	$scope.onEdit=function(item){
	}
	$scope.list=[
		{title:"item1", content:"content1"},
		{title:"item2", content:"content2"},
	]
	
	$scope.list.forEach(function(item){
		item.buttons=[
			{
				item:this,
				icon:"cog",
				callback:function(){
					//access: this.item
				}
			}
		]
	});
</script>

<il-panel ng-repeat="item in list" 
	title="item.title" 
	can-delete="true" on-delete="onDelete(item)" 
	can-edit="true" on-edit="onEdit(item)"
	buttons="item.buttons"
>
	This is the content: {{item.content}}
</il-panel>

``` 

# ilLoadingButton

This is a button than it's self converted into a loading text when is pressed.

* **button-label**: The button text
* **button-style**: Bootstrap style (primary, success, info, warning and danger)
* **loading-text** (optional, by default "loading...")
* **enabled** (optional, by default is true): if button is enabled
* **on-click**: Callback will be called when user click the button.

##Example

```html
<script>
$scope.verify=function(callback){
	//If text is void, the button doesn't change to loading
	//Callback returns false
	if ($scope.text==undefined || $scope.text=="")
		return false;
	
	//This simule a WebService call.
	//When finish loading operation, you must call to callback if operation is OK and call bacllback with error text as param if operation is KO
	$timeout(function(){
		callback();
	},1000);
	
	//Return true to change button to loading
	return true;
}
</script>

<input ng-model="text"></input>

<il-loading-button button-label="'Verify'" loading-text="'Verifing...'" on-click="verify(callback)"></il-loading-button>
```


# ilSearch
This is a simple input that allows filter an array of objects using any of their fields and with acute and case insensitive.

![ilSearch example](https://ilscdn.s3.amazonaws.com/il.angularUI/doc/ilSearch.png "ilSearch example")

```html
<script>
$scope.model=[
	{label:"Cat",value:1},
	{label:"Castor",value:2},
	{label:"Dog",value:3},
	{label:"Parrot",value:4},
]
</script>

<il-search
	model="mc.model"
	fields="['label']"
	on-filter="list=result"
	method="'startWith'"
></il-search>

<table class="table">
	<tr ng-repeat="item in list">
		<td>{{item.label}}</td>
	</tr>
</table>
```

## Basic configuration

 * **model**: Original list
 * **fields**: List of fields to filter
 * **on-filter(result)**: Callback to get result of filter
 * **method** (optional, by default is normal): Methods to filter (See il.angularExtends - ilArraySearch)
	 * normal
	 * startWith or sw
	 * anyWord or aw
	 * completeWord or '='

## Advanced configuration
If you need more control you can define advanced configuration instead of define fields.

```html
<script>
$scope.config = [
	{
		field:'value',
		method:'fnc',
		filter:function(fieldValue,searchCad){
			//Check if is integer
			if (isNaN(parseInt(searchCad * 1)))
				return false;
				
			//Integer comparation
			return searchCad<fieldValue;

		}
	}
]
</script>

<il-search
	model="mc.model"
	config="config"
	on-filter="list=result"
	method="'startWith'"
></il-search>
```

For more information See il.angularExtends - ilArraySearch

# ilCVSTable
Allows to paste a CVS and transform to array of objects. Allow check and correct values too.

From this:
![ilCvsTable example](https://ilscdn.s3.amazonaws.com/il.angularUI/doc/ilCVSTable1.png "ilCvsTable example")

To this:
![ilCvsTable example](https://ilscdn.s3.amazonaws.com/il.angularUI/doc/ilCVSTable2.png "ilCvsTable example")

##Basic usage

* **on-confirm(items)**: Callback to get result when user confirms. Only valid items are returned 

```HTML
<script>
$scope.onConfirm=function(items){
	//Do something with items
}
</script>
<il-cvs-table 
	on-confirm="onConfirm(items)" 
></il-cvs-table>
```

##Working with headers

* **transform-header(value)**: Transform header name to other. Value is the name of header
* **check-header(header)**: check if headers are correct. Header is an array. **transform-header** is called previous so it'll recieve a transformed header

```HTML
<script>
$scope.onConfirm=function(items){...}

$scope.transformHeader=function(value){
	//Transform all headers to lower case
	return value.toLowerCase();
}

$scope.checkHeader=function(header){
	//Check if all required headers are in list
	var required=["name","email"];
	for (var r in required){
		var found=false;
		header.some(function(h){
			if (required[r]==h){
				found=true;
				return true;
			}
		})
		
		if (!found)
			return false;
	}
	return true;
}

</script>

<il-cvs-table 
	transform-header="transformHeader(value)"
	check-header="checkHeader(header)"
	on-confirm="onConfirm(items)" 
></il-cvs-table>
```

##Column config

* **column-config**: Object with columns to controll

For each column the configuration is:

* **type**: Type of column, by default is text
	* text: Text entry
	* list: List of values
	* listObject: List of objects
	* readonly: Readonly, cannot modify value
* **check(value)**:Check function than returns true if value is correct or a message with error
* **transform(value)**: Transform function. Returns the transformed value (after check function)
* **values**: Values in case of list or listObject type
* **labelField**: Lavbel field in case of listObject type

```javascript
$scope.ages=[];
for(var i=1; i<100; i++)
	$scope.ages.push(""+i);

$scope.sex=[
	{label:"Man",value:1},
	{label:"Woman",value:2}
]
				
$scope.columnConfig={
	id:{
		type:"readonly",
	},
	age:{
		type:"list",
		values:mc.ages,
		check:function(value){
			if (value<=0)
				return "Age must be >0";
		}
	},
	email:{
		type:"text",
		check:function(value){
			if (!validateEmail(value))
				return "Invalid email";
		}
	},
	sex:{
		type:"listObjects",
		values:mc.sex,
		labelField:"label",
		check:function(value){
			if (typeof value === 'object')
				return true;
			else{
				if ( mc.sex[value-1]==undefined)
					return "Values 1 or 2";
				else
					return true;
			}
		},
		transform:function(value){
			return mc.sex[value-1];
		}
	}
}
```

```HTML
<il-cvs-table 
	transform-header="transformHeader(value)"
	check-header="checkHeader(header)"
	column-config="columnConfig"
	on-confirm="onConfirm(items)" 
></il-cvs-table>
```

## Aditional item check

* **check-item(item,header)**: Function to check whole item. Returns true if is correct or msg if is invalid.

---

#ilTable2
It is similar to ilTable, most important difference is that columns are declared in HTML and you have css full control. Additionaly you have all power of ilInput

Complete example:

![ilTable2 example](https://ilscdn.s3.amazonaws.com/il.angularUI/doc/ilTable2.png "ilTable2 example")

Script data inizialization example:
```HTML
<script>
$scope.data.items=[];
$scope.data.values=[];
$scope.data.sex=[
	{label:'Man',value:0},
	{label:'Woman',value:1},
];

for (var i=0; i<20; i++){
	$scope.data.items.push({id:i,name:"name "+i*100,lastname:"lastname "+i,value:i,sex:mc.sex[i%2]});
	$scope.data.values.push(i);
}

$scope.customButtons=[
	{
		icon:'envelope',
		fnc:function(item){
			console.debug("Custom button!",item);
		}
	},
	{
		awesomeIcon:"anchor",
		fnc:function(item){
			console.debug("Custom awesome button",item);
		}
	}
]

$scope.renderer_sex=function(item,column){
	if (item.sex.value==1)
		return '<i style="color:pink" class="fa fa-female"></i>';
	else
		return '<i style="color:cyan" class="fa fa-male"></i>';
}

</script>
```

HTML table configuration:

```HTML
<il-table2 
	model="data.items" 
	class="table table-striped ilTable2"
	title="'My table'"
	show-header=true
	show-search=true
	show-pagination=true
	select-on-click=false
	select-multiple=true
	show-download=true
	delete-confirm=true
	header-buttons=headerButtons
>
	<il-table2-column 
		type="'select'">
	</il-table2-column>
	
	<il-table2-column 
		title="'Id'"
		field="'id'">
	</il-table2-column>
	
	<il-table2-column
		type="'render'"
		title="'Sex'" 
		renderer="renderer_sex">
	</il-table2-column>
				
	<il-table2-column 
		title="'Name'"
		type="'ilInput'"
		il-input-type="'text'"
		field="'name'">
	</il-table2-column>
	
	<il-table2-column 
		title="'Lastname'" 
		type="'ilInput'"
		il-input-type="'password'"
		field="'lastname'">
	</il-table2-column>
	
	<il-table2-column
		title="'Value'"
		type="'ilInput'"
		il-input-type="'select'"
		field="'value'"
		select-options="data.values">
	</il-table2-column>
	
	<il-table2-column 
		title="'Sex'" 
		type="'ilInput'"
		il-input-type="'select'"
		field="'sex'"
		select-options="data.sex"
		select-label-field="'label'"
		search-method="'startWith'">
	</il-table2-column>
	
	<il-table2-column 
		title="'Template'"
		type="'include'"
		include="'template.html'"
		edit-include="'templateEdit.html'"
		>
	</il-table2-column>
	
	<il-table2-column 
		type="'buttons'"
		can-edit=true 
		can-delete=true 
		custom="mc.customButtons">
	</il-table2-column>
</il-table2>
```


## Options

Basic options:

* **model**: List of items to show

Show/hide parts:

* **show-search** (by default true): Show search field
* **show-header** (by default true): Show header (title and buttons)
* **show-pagination** (by default true): Show pagination. If it's false, all items will showed
* **show-footer** (by default true): Show footer
* **show-download** (by default true): Show download button (require header visible)

Header:
*Note: Only if header is visible*

* **title**: Title of table
* **header-buttons**: It's an array of objects with this format
	* icon: bootstrap icon
	* awesomeIcon: Awesome icon (use instead of icon)
	* fnc(item): Callback function when button is presed

Example:
```js
{
	icon:'envelope',
	fnc:function(item){
		console.debug("Custom button!",item);
	}
}
```

Pagination:

* **items-per-page** (by default 5): Number of items in each page
* **items-per-page-options** (by default [5,10,20]): List of pagination options.

Click items:

* **on-click-item**: Callback on click item. Params:
	* item: clicked item
	* column: what column has it clicked on?

Selection:

* **select-on-click** (by default false): Enable select item when click on it.
* **select-multiple** (by default false): Enhable multiple selection
* **on-selected**: Callback when selection has changed. Params:
	* list: List of all selected items
	* item: Last item selected or unselected, cause of event

Delete

* **delete-confirm** (by default true): Check with user if procede with delete 
* **delete-confirm-text** (by default 'are your sure?'): Message to confirm.
* **delete-fnc**: Check if item can be deleted and delete it. Returns true if item has deleted or false in other case. Params:
	* item: Item to delete
* **on-delete**: Callback when delete
	* item: deleted item

## Columns
In a table there are a set of columns, some are information columns, an other are special columns. To define these use: `il-table2-column` entity

Required atributtes:

* **type** (by default 'basic'): column type
	* basic
	* ilInput: Editable column
	* render
	* template
	* selection
	* buttons
* **title**: Title of column
* **field**: Field Of item to show (Required only in basic and ilInput columns)
* **search-method**: Search method
	* 'startWith': Word must start with search cad
	* In other case:

```HTML
<il-table2-column type="'basic'" title="'Id'" field="'id'"></il-table2-column>
```

## Basic columns
Basic columns show a field of each item.

```HTML
<il-table2-column type="'basic'" title="'Id'" field="'id'"></il-table2-column>
```

## Editable columns (ilInput)
Use ilInput as item-field renderer, so you can use all options of ilInput. 

All ilInput are preceded by `il-input-` for instance, to define the type of ilInput use `il-input-type`

```HTML
<il-table2-column type="'ilInput'" title="'Name'" il-input-type="'text'" field="'name'"></il-table2-column>
```

## Render columns
Render column uses a function than returns HTML code to show.

* **renderer**: Function to render

Column declaration
```HTML
<il-table2-column type="'render'" title="'Sex'" renderer="renderer_sex"></il-table2-column>
```

Render function
```JS
$scope.renderer_sex=function(item,column){
	if (item.sex.value==1)
		return '<i style="color:pink" class="fa fa-female"></i>';
	else
		return '<i style="color:cyan" class="fa fa-male"></i>';
```


## Template columns
This column are more powerfull than render column because can use html templates to render and edit mode render.

* **include**: Include template renderer. To acces to item, use `item` or `currentModel(item)`
* **edit-include**: Include template renderer for edition. To access to edit item use `currentModel(item)`

```HTML
<il-table2-column type="'include'" title="'Template'"  include="'template.html'" edit-include="'templateEdit.html'"></il-table2-column>
```

Renderer:
```HTML
Hello <span style="color:olive">{{item.name}}</span>
```

Edit renderer:
```HTML
<input style="color:olive" ng-model="currentModel(item)['name']">
```


## Special columns

### Select column
This column allows to select columns and show them with a check box

```HTML
<il-table2-column type="'select'"></il-table2-column>
```

### Buttons column
This column allows to add basic operations and custom buttons to each row

* **can-edit**: Shows edit button
* **can-delete**: Shows delete button
* **custom**: Custom buttons

```HTML
<il-table2-column type="'buttons'" can-edit=true can-delete=true custom="customButtons"></il-table2-column>
``` 

#### Custom buttons definition
A list of objects that represents each button.

* **icon**: Bootstrap icon
* **awesomeIcon**: Awesome icon (exluce icon)
* **fnc** : Callback when button is clicked
	* item: Row item clicked

```JS
$scope.customButtons=[
	{
		icon:'envelope',
		fnc:function(item){
			console.debug("Custom button!",item);
		}
	},
	{
		awesomeIcon:"anchor",
		fnc:function(item){
			console.debug("Custom awesome button",item);
		}
	}
]
```
