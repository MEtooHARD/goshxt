# goshxt 


### Major Update (2025/12)
made packages for WIN/Mac/Linux
no installation of Node.js needed
just start with single click
 
---  

### Major Update
- Added straight log message for most of the events/stages.
- Calls the add course function directly, it should be much faster than ever.
- Added a handy Button for manual trigger adding all courses. At the right bottom corner, a blue button will be set after necessary process is finished.

### Necessary configurations:
1. download and install `node.js`
1. create `config.json` in
![alt text](https://github.com/594-666/goshxt/blob/main/demo.png?raw=true) 
1. add the below content to `config.json`:

```
{
    "student_id": "",
    "password": "",
    "fullauto": true,
    "time": "2025-5-28 12:30"
  }
  ```
  and fill-in the corresponding information.
  *These data won't be exposed to anywhere outside your device and the NDHU course website.*
## Explaination
- Saying `select` here, I mean a behaviour that is basically equivalent to clicking the ![add course button](https://github.com/594-666/goshxt/blob/main/add_btn.png?raw=true).
- By my observation, the ![add course button](https://github.com/594-666/goshxt/blob/main/add_btn.png?raw=true)s will be released 10 minutes before course-selection.
- **goshxt** runs up a browser to work with the course website. Please get **goshxt** ready within this period of time, and do not do anything else in case any unexpected failure happens.
- **goshxt** reads your `password` and `student_id` to login to the course website. And inspects your preselection to ~~kidnap~~ get necessary data of your ![add course button](https://github.com/594-666/goshxt/blob/main/add_btn.png?raw=true)s.
- If `fullauto` is `true`, **goshxt** *should* get all your preselected courses selected once the time hits.
- **goshxt** also provides the <img src="https://github.com/594-666/goshxt/blob/main/SS_btn.jpg?raw=true" alt="SS button" height="25"/>, this button selects all your preselected courses. You can click it once you found that **goshxt** didn't trigger selecting on time. Or if you set `fullauto` to `false`, you'll need to select them by yourself, as if so **goshxt** won't trigger selecting.
- **goshxt** uatomatically accepts any dialogs and logs the message in the console.
- You should be able to test if **goshxt** runs properly at any time as the website is likely open 24/7.
---  

###  see [goshxt demonstration](https://youtu.be/va9Spg4j-Mg)  (this is an out dated demo, but the main workflow is similar)
## **Contributors:**
- ## **script:** [MEtooHARD](https://github.com/MEtooHARD)
- ## **video:** [ToiletKing](https://www.youtube.com/@ToiletKing)

for any noun you don't know, just google or ask your csie classmates(though they may not know, either)  
任何看不懂的名詞請google或找個資工系的同學問(他們可能也不會就是了)


(或是你想加我discord: @metoohard)

(來陪我玩啦)

(來啦)
