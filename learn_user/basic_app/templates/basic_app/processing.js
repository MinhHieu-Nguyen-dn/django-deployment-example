var data;
var data_json;
var num = 0;
var data_ok = ["Start ok"];
var data_delete = ["Start del"];
var max;
var count_user;
var arr_tmp = [];
var count_tmp = 0;

document.getElementById('file-input').addEventListener('change', readJson_file, false);

function readJson_file(e) {
    var file = e.target.files[0];

    if (!file) {
        return;
    }

    var reader = new FileReader();
    reader.onload = function (e) {
        setData(event.target.result);
    };
    reader.readAsText(file);
}

function setData(input_string) {
    data = input_string;
    if (testJSON(data) == true) {
        data_json = JSON.parse(data);
        if (check_begin() == 3) {
            alert("FILE KHÔNG HỢP LỆ, RELOAD VÀ CHỌN FILE MỚI!");
        } else {
            if (check_begin() == 1) {
                document.getElementById("show").innerHTML = data_json[0].answer;
                find_max();
                count_user = 1;
            } else {
                document.getElementById("show").innerHTML = data_json[1].answer;
                num = 1;
                max = parseInt(data_json[0].max);
                count_user = parseInt(data_json[0].count);
                delete data_json[0].max;
                delete data_json[0].count;
            }
            document.getElementById("count_u").innerHTML = count_user.toString() + " / " + max.toString() + " Users";
        }
    } else if (testJSON(data) == false) {
        alert("FILE KHÔNG HỢP LỆ, RELOAD VÀ CHỌN FILE MỚI!");
    }
}

function check_begin() {
    if (data_json[0].hasOwnProperty("answer") == true) {
        return 1;
    } else {
        if (data_json[0].hasOwnProperty("count") == true) {
            return 2;
        } else {
            return 3;
        }
    }
}

function find_max() {
    max = Object.keys(data_json).length;
}

function testJSON(text) {
    if (typeof text !== "string") {
        return false;
    }
    try {
        JSON.parse(text);
        return true;
    } catch (error) {
        return false;
    }
}

function myFunction(key_in) {
    if (testJSON(data) == true) {
        if (num <= data_json.length - 1) {
            if (key_in == 1) {
                data_ok.push(data_json[num].answer);
                insert_row(data_json[num].answer, "yes_col");
                document.getElementById("c_data_o").innerHTML = data_ok.length-1;
            } else if (key_in == 0) {
                data_delete.push(data_json[num].answer);
                insert_row(data_json[num].answer, "no_col");
                document.getElementById("c_data_b").innerHTML = data_delete.length-1;
            }
            delete_object(num);
            num = num + 1;
            if (num <= data_json.length - 1) {
                if (data_json[num].hasOwnProperty("answer") == false) {
                    alert("INVALID FILE, STOP!!");
                } else {
                    if (num <= data_json.length - 1) {
                        document.getElementById("show").innerHTML = data_json[num].answer;
                        count_user = count_user + 1;
                        document.getElementById("count_u").innerHTML = count_user.toString() + " / " + max.toString() + " Users";
                    } else {
                        document.getElementById("show").innerHTML = "HẾT DATA!";
                    }
                }
            } else {
                document.getElementById("show").innerHTML = "HẾT DATA!";
            }
        } else {
            document.getElementById("show").innerHTML = "HẾT DATA!";
        }
    } else if (testJSON(data) == false) {
        alert("FILE KHÔNG HỢP LỆ, RELOAD VÀ CHỌN FILE MỚI!");
    }
}

function delete_object(num) {
    delete data_json[num]._id;
    delete data_json[num].UserID;
    delete data_json[num].question;
    delete data_json[num].answer;
    delete data_json[num].timeStamp;
    delete data_json[num].pageID;
}

function download(clear_bad, f_mark) {
    document.getElementById("show").innerHTML = "LƯU DỮ LIỆU CHƯA ĐƯỢC XỬ LÝ ĐỂ DÙNG CHO LẦN TIẾP THEO!";
    var element = document.createElement("a");
    var text = "";
    if (f_mark == "ok") {
        var i;
        for (i = 1; i < data_ok.length; i++) {
            text += i.toString() + ". " + data_ok[i] + "\n";
        }
    } else if (f_mark == "bad") {
        var i;
        for (i = 1; i < data_delete.length; i++) {
            text += + i.toString() + ". " + data_delete[i] + "\n";
        }
    }
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text));
    var d = new Date();
    var filename = (d.getDate()).toString() + "_" + (d.getMonth() + 1).toString() + "_" + (d.getFullYear()).toString() + "_" + clear_bad;
    element.setAttribute('download', filename);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

function download_remaining() {
    var element = document.createElement("a");
    var data_output = JSON.stringify(data_json);
    var i;
    for (i = 0; i <= num; i++) {
        data_output = data_output.replace("{},", "");
    }
    count_user = count_user.toString();
    max = max.toString();
    const mark_pos = {
        "count": count_user,
        "max": max
    };
    var mark_str = JSON.stringify(mark_pos) + ",";
    mark_str = " [ " + mark_str;
    data_output = data_output.replace("[", mark_str);
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(data_output));
    var d = new Date();
    var filename = (d.getDate()).toString() + "_" + (d.getMonth() + 1).toString() + "_" + (d.getFullYear()).toString() + "_remaining_data";
    element.setAttribute("download", filename);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    alert("ĐỢI LƯU FILE DỮ LIỆU CHƯA XỬ LÝ SAU ĐÓ TẢI LẠI TRANG ĐỂ THOÁT HOẶC BẮT ĐẦU LẦN MỚI");
    document.getElementById("show").innerHTML = "TẢI LẠI TRANG ĐỂ THOÁT HOẶC BẮT ĐẦU LẦN MỚI";
}

function insert_row(txt, col_name) {
    var table = document.getElementById(col_name);
    var row = table.insertRow(-1);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var pos_row = table.rows.length - 1;
    arr_tmp[count_tmp] = {};
    if (col_name == 'yes_col') {
        var mark = 1;
        arr_tmp[count_tmp] = {
            mark: mark,
            pos_row: pos_row,
            text: txt
        }
    } else if (col_name == 'no_col') {
        var mark = 0;
        arr_tmp[count_tmp] = {
            mark: mark,
            pos_row: pos_row,
            text: txt
        }
    }
    cell1.innerHTML = '<td style="border: 1px solid black; width: 800px;"><p style="word-break: break-all;">' + txt + '</p></td>';
    cell2.innerHTML = `<button type="button " onclick="change_col(${count_tmp})">CHANGE</button>`;
    count_tmp += 1;
}

function change_col(count_t) {
    if (arr_tmp[count_t].mark == 1) {
        var x = document.getElementById("yes_col").rows[arr_tmp[count_t].pos_row];
        x.deleteCell(1);
        var x = document.getElementById("yes_col").rows[arr_tmp[count_t].pos_row].cells;
        x[0].innerHTML = "";
        insert_row(arr_tmp[count_t].text, 'no_col')
        data_delete.push(arr_tmp[count_t].text);
        data_ok.splice(data_ok.indexOf(arr_tmp[count_t].text), 1);
    } else if (arr_tmp[count_t].mark == 0) {
        var x = document.getElementById("no_col").rows[arr_tmp[count_t].pos_row];
        x.deleteCell(1);
        var x = document.getElementById("no_col").rows[arr_tmp[count_t].pos_row].cells;
        x[0].innerHTML = "";
        insert_row(arr_tmp[count_t].text, 'yes_col');
        data_ok.push(arr_tmp[count_t].text);
        data_delete.splice(data_delete.indexOf(arr_tmp[count_t].text), 1);
    }
    document.getElementById("c_data_o").innerHTML = data_ok.length-1;
    document.getElementById("c_data_b").innerHTML = data_delete.length-1;
}