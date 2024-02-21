# goshxt  

download and install `node.js`  

### Prepare for some necessary configurations:

1. create `config.json`  
![alt text](https://github.com/594-666/goshxt/blob/main/demo.png?raw=true)  
2. in `config.json`, add:  

```
{
    "student_id": "",
    "password": "",
    "manual": false,
    "dialog_delay_accept": 0,
    "time": "YYYY-MM-DD hh:mm",
    "showViewPort": true
}
```  

3. fill in `student_id` & `password`  
4. replace `YYYY-MM-DD hh:mm` with the correct date and time  
5. `showViewPort`: `true` => show browser window, `false` => vice versa  

`manual` and `dialog_delay_accept` will be explained later.  

---
### Almost there!

Open a terminal in the folder of this repo  
You can simply use vscode to open the folder and press `shift` + `ctrl` + `C` (only available in windows)  
Or just use vscode's terminal  

### Execute:  

1. ### run `npm i`  
2. ### run `npm start`  

![alt text](https://github.com/594-666/goshxt/blob/main/terminal.png?raw=true)  

---  

### Code flow explained  

This script will first lead you to the website and login with the `id` and `password` you provided.  
And will switch to the ![pre schedule btn](https://github.com/594-666/goshxt/blob/main/pre_schedule.png?raw=true) list page.  
Then it'll see whether the moment you run this script is before the system open.  
If it is, The script will run the course adding part right after the system is opened.  
If not, it'll start adding immediately.  
And there's a listener for `'dialog'` event, this script will accept any pop-up dialogs.

**Important:**  
this script will simply try to click every available ![alt text](https://github.com/594-666/goshxt/blob/main/add_btn.png?raw=true) button from your pre-schedule list  
**For the best-case, please *not to* make any *clashes* in your pre-schedule list.**  

---

### The `manual` option

- `false`(default):  
This script will add the courses for you.
- `true`  
This script will only login and lead you to the pre-schedule page.  
All the dialogs will be accepted immediately.  
So you can just quickly go through the courses and add them, no need to click the noisy dialogs.  
![alt text](https://github.com/594-666/goshxt/blob/main/dialog.png?raw=true)  
(as the trade off, you won't be able to immediately know whether the course is successfull added)  

### The `dialog_delay_accept` option  
- This option is a number, when `manual` is true, the page will accept the dialog after the number you given (milliseconds). Which allows you to see the dialog message.  

---  

###  see [goshxt demonstration](https://youtu.be/va9Spg4j-Mg)  
# **Contributor:**
- ## **code:** [MEtooHARD](https://github.com/MEtooHARD)
- ## **video:** [ToiletKing](https://www.youtube.com/@ToiletKing)

for any noun you don't know, just google or ask your csie classmates(though they might not know those either)  
任何看不懂的名詞請google或找個資工系的同學問(他們可能也不會就是了)
