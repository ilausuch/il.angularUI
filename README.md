# il.angularUI

Collection of user interface elements.

# ilInput

Featured angular inputs. 

This is the list of input types: text, password, boolean, date, time, dateTime, select, autocomplete

## General configuration

### model and field

These attributes are required and represent the model of input. Model defines the object and field defines the attribute in model 

```php
<script>
	...
	$scope.data={
		name:"Hello world"	
	}
	...
</script>
<input model="data" field="'name'">
```

### label

Add a label over the input field

```php
<input model="data" field="'name'" label="'Name'">
```

### placeholder

Set placeholder when input is empty

```php
<input model="data" field="'name'" label="'Name'" placeholder="'Enter your name'">
```


### required, requiredVisible, requiredLabel

Define if field is required.
If is required 'requiredLabel' is showed after label, by default is an red '*'.
requiredVisible controls if required label is visible or not.

```php
<input model="data" field="'name'" label="'Name'" required="true" required-label="'(* required)'">
```


### innerLabel, innerIcon and innerAwesomeIcon

'innerLabel' allows to add a text inside input. 
```php
<input model="data" field="'name'" label="'Name'" inner-label="'My name'">
```

'innerIcon' allows to add a bootstrap icon. For instance to use bootstrap user icon 'glyphicon glyphicon-user'
```php
<input model="data" field="'name'" label="'Name'" inner-icon="'user'">
```

'innerAwesomeIcon' allows to add a bootstrap icon. For instance to use bootstrap user icon 'fa fa-user'. You must include awesomeFonts
```php
<input model="data" field="'name'" label="'Name'" inner-awesome-icon="'user'">
```


### verifyShow, verifyFnc, verifyGroup, verifyIfVoid



### onChange

### z, modalOnTop


## text

textVerifyInt, textVerifyFloat

## password
## select

* selectVerifyRequired
* selectOptions
* selectLabelField
* selectLabelFnc
* selectValueField
* selectValueFnc


## date

* dateMinYear
* dateMaxYear
* dateShowYearCombo
* dateAvailableDates
* dateCanChangeMonth
* dateFixModal
* dateLocale

## time

timeSeconds

## dateTime


## autocomplete

* autocompleteSearchMethod

## boolean

* booleanTrue
* booleanFalse
* booleanTrueHtml
* booleanFalseHtml


# ilAdvancedCombo
# ilTable
# ilDetail
# ilModal
# ilWeek
# ilYearCalendar
# ilUpload
# ilSurvey


# Column types

## text
## textarea
## boolean
## select
## autocomplete
## select-object
## autocomplete-object
## html
## template
## dates