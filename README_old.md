# goshxt 

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
    "time": "2024-12-20 12:30"
}
```  
What are these attributes used for?
-  `student_id`: your id.
-  `password`: your password.
-  `headless`: any falsy/truthy value in javascript
   -  true: the browser window will not present, vice versa.
- `YYYY-MM-DD hh:mm`: the time the systems opens
  - this can actually be in any valid format if you know how to do, see: [Date.parse()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse)
  - otherwise, please make sure the format fits.

- `manual`: will be explained later.  

(basically you only need to fill-in the `id`, `password` and`time`)

---
### Almost there!

Open a terminal in the folder of this repo  
You can simply use vscode to open the folder and press `shift` + `ctrl` + `C` or `shift` + `command` + `C`  
Or just use vscode's terminal  

### Execute:  
> ### run `npm i` (npm install)

> ### run `npm start`  

![alt text](https://github.com/594-666/goshxt/blob/main/terminal.png?raw=true)  

---  

### Work flow explained  

This script will first lead you to the website and login with the `id` and `password` you provided.  
Then switch to the ![pre schedule btn](https://github.com/594-666/goshxt/blob/main/pre_schedule.png?raw=true) page.  
It'll see if the moment you run this script is before the system open.  
If it is, The script will run the course adding part right after the system opened.  
If not, it'll start adding immediately.  
And there's a listener for `'dialog'` event, this script will accept any dialogs.

**Important:**  
this script simply try clicking every available ![add_course_btn](https://github.com/594-666/goshxt/blob/main/add_btn.png?raw=true) button from your pre-schedule list  
**For the best case, please *DO NOT make any clashes* in your pre-schedule list.**  

**Course System:**
The system releases the add-course button ![add_course_btn](https://github.com/594-666/goshxt/blob/main/add_btn.png?raw=true) at least 1hr before you can add.  
This script simply click them when the time comes.  
You can click them all again, just in case. We've someone's local time not synced with the server so it couldn't add the courses in time.  
(You won't see the adding failure/success prompts after you clicked the ![add_course_btn](https://github.com/594-666/goshxt/blob/main/add_btn.png?raw=true) , since this script accepts all of them immediately)
Before the script ends, there's 10min. You can check your status without additional login.  

---

### The `manual` option

- `false`(default):  
This script will add the courses for you.
- `true`  
This script will only login and lead you to the ![pre schedule btn](https://github.com/594-666/goshxt/blob/main/pre_schedule.png?raw=true) page.  
All the dialogs will be accepted immediately.  
So you can quickly go through the courses and add them, no need to click the noisy dialogs.  
![alt text](https://github.com/594-666/goshxt/blob/main/dialog.png?raw=true)  
(as the trade off, you won't be able to immediately know whether the course is successfully added)  

---  

###  see [goshxt demonstration](https://youtu.be/va9Spg4j-Mg)  
# **Contributors:**
- ## **script:** [MEtooHARD](https://github.com/MEtooHARD)
- ## **video:** [ToiletKing](https://www.youtube.com/@ToiletKing)

for any noun you don't know, just google or ask your csie classmates(though they may not know, either)  
任何看不懂的名詞請google或找個資工系的同學問(他們可能也不會就是了)


(或是你想加我discord: @metoohard)

(來陪我玩啦)

(來啦)
