const classList = document.querySelector("#classList");
const classInput = document.querySelector("#classInput");
const addBtn = document.querySelector("#addBtn");

// ページ読み込み時に localStorage から読み込む
window.onload = () => {
    const saved = JSON.parse(localStorage.getItem("classes")) || [];
    saved.forEach(addClassElement)
}
// 授業追加ボタン
addBtn.addEventListener("click",() =>{
    const text = classInput.value.trim();
    if (text === "") return;

    const classData = {
        text,
        count: 0,
        risk: "まだ大丈夫"
    };

    addClassElement(classData);

    saveClass(classData);

    classInput.value="";
})
//欠席,遅刻,削除ボタン
classList.addEventListener("click",(e)=> {
    const target = e.target;
    const tr = target.closest("tr");

    if (!tr) return;

    const nameTd = tr.querySelector(".name-Td");
    const text = nameTd ? nameTd.textContent : '';
    if (!text) return;

    if (target.classList.contains("delete-btn")){
        deleteClass(text);
        tr.remove();
    } else if (target.classList.contains("absent-btn")){
        absentClass(text);
    } else if (target.classList.contains("late-btn")){
        lateClass(text);
    }
})

//危険度表示関数
function updateRisk(count) {
    if (count >= 5) {
        return "🔥 落単";
    } else if (count >= 4) {
        return "⚠️ 非常に危険";
    } else if (count >= 3) {
        return "🚨 危険";
    } else if (count > 0) { // 0より大きい場合（1回以上）
        return "注意";
    } else {
        return "まだ大丈夫";
    }
}

//授業を画面に追加する関数
function addClassElement(classData) {
    const tr = document.createElement("tr");

    const nameTd = document.createElement("td");
    nameTd.textContent = classData.text;
    nameTd.classList.add("name-Td");
    
    const countTd = document.createElement("td");
    countTd.textContent = classData.count;
    countTd.classList.add("class-Td");
    
    const riskTd = document.createElement("td");
    riskTd.textContent = updateRisk(classData.count); 
    riskTd.classList.add("risk-Td");

    const actionTd = document.createElement("td");
    actionTd.classList.add("action-Td");

    const absentBtn = document.createElement("button");
    absentBtn.textContent = "欠";
    absentBtn.classList.add("absent-btn");

    const lateBtn = document.createElement("button");
    lateBtn.textContent = "遅";
    lateBtn.classList.add("late-btn");
    
    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.textContent = "削";
    deleteBtn.classList.add("delete-btn");

    actionTd.appendChild(absentBtn);
    actionTd.appendChild(lateBtn);
    actionTd.appendChild(deleteBtn);


    tr.appendChild(nameTd);
    tr.appendChild(countTd);
    tr.appendChild(riskTd);
    tr.appendChild(actionTd);

    classList.appendChild(tr);
}

//localStorageへ保存
function saveClass(classData){
    const classes = JSON.parse(localStorage.getItem("classes")) || [];
    classes.push(classData);
    localStorage.setItem("classes",JSON.stringify(classes));
}

//出席状況を更新
function updateClassStatus(updatedClass){
    const classes = JSON.parse(localStorage.getItem("classes")) || [];

    const updated = classes.map(c =>
        c.text === updatedClass.text ? updatedClass : c
        
    );

    localStorage.setItem("classes",JSON.stringify(updated))
}

//授業削除
function deleteClass(text){
    const classes = JSON.parse(localStorage.getItem("classes")) || [];
    const updated = classes.filter(c => c.text!==text);
    localStorage.setItem("classes",JSON.stringify(updated));
}

//欠席回数カウント
function absentClass(text) {
    const classes = JSON.parse(localStorage.getItem("classes")) || [];

    const updated = classes.map(c => {
        if (c.text === text) {
            return {
                ...c,
                count: c.count + 1
            };
        }
        return c;
    });

    localStorage.setItem("classes", JSON.stringify(updated));
    renderClassList();

    
}

//遅刻回数カウント
function lateClass(text) {
    const classes = JSON.parse(localStorage.getItem("classes")) || [];

    const updated = classes.map(c => {
        if (c.text === text) {
            return {
                ...c,
                count: c.count + 0.5
            };
        }
        return c;
    });

    localStorage.setItem("classes", JSON.stringify(updated));
    renderClassList();

    
}

//リストを表示
function renderClassList(){
    classList.innerHTML="";
    const classes = JSON.parse(localStorage.getItem("classes")) || [];
    classes.forEach(classData => {
        addClassElement(classData);
    });
}
