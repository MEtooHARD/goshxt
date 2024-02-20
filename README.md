# goshxt  
  
How to use:

create `config.json` under `src`  
![alt text](https://github.com/594-666/goshxt/blob/main/demo.png?raw=true)  
in `config.json`, add:  
```
{
    "student_id": "",
    "password": "",
    "manual": false,
    "time": "YYYY-MM-DD hh:mm"
}
```
### fill in `student_id` & `password` and replace `YYYY-MM-DD hh:mm` with the correct time

This script can add all the courses in your pre-schedule list  

You can set `manual` to `true` if you want to click the courses by yourself 
- If you do that, this script will lead you to the pre-schedule page then you can start adding  
all the dialogs will be immediately accepted, i.e., you won't need to worry about the tiny pop-up block
  
- If you leave `manual` as false  
please make sure all your pre-scheduled courses have no clashes  
this script will wait until the open time.  
Tt won't automatically refresh.  
So, just run this script at most 10 mins before the open time, in case, you know : )  

### now you can start running this script
Open a terminal in the folder of this repo  
You can simply use vscode to open the folder and press `shift` + `ctrl` + `C` (only available in windows)  
Or just use vscode's terminal  
### run `npm start`
