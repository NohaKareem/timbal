# to-do

## design
* add system page
* form updates
    * delete button
    * input textfield
    * input date & 2 time fields
* remove arrows + update timeline
* 

## front-end
* setup vuex
    * setup user variable
    * setup day variable
* day input form
    * transitions
* [MVP] display timeline
* [MVP] display bubble chart

## back-end
### fix
* [MVP] POST day 
    * date change on adding time ([https://stackoverflow.com/a/52965025/1446598](try ISODate()))
    * date change in db
    * full_cateogry array
        * find category id by code
* [MVP] GET days by date
    * lt date
* auth
    * upload image 

### build

* time series
    * fix date format data
    * text (consider network diagrams in d3)
    * zoom x-axis
    * multiple days
    * apply styling
    * pass event on tool tip 
* bubble chart
    * connect bubble
    * prepare data
    * connect data

#### routes
* GET all top-level categories, return code and title 
* GET all non-top-level categories, return code and title
