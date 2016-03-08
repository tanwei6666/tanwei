// 这个文件定义了关于下拉框的各种方法

// 获取下拉框的当前选中值
function getSelectedValue(selectorid) {
    var selector = document.getElementById(selectorid);
    if (selector &&
        selector.children.length > 0 &&
        selector.children[selector.selectedIndex] != null) {
        return selector.children[selector.selectedIndex].value;
    }
    else return '';
}

// 设置下拉框的值
function setSelectValue(selectorid, value, needFireEvent) {
    var selector = document.getElementById(selectorid);
    if (selector && !selector.disabled) {
        for (var i = 0; i < selector.children.length; i++) {
            var child = selector.children[i];
            if (child.value == value) {
                child.selected = "true";
                if (needFireEvent == true) {
                    fireEvents(selector, 'MouseEvents', 'change');
                }
                break;
            }
        }
    }
}

// 创建下拉项
function createOption(text, value) {
    var oOption = document.createElement("OPTION");
    oOption.text = text;
    oOption.value = value;
    return oOption;
}

// 清空下拉框的所有选项
function clearOptions(selectorid) {
    var selector = document.getElementById(selectorid);
    if (selector) {
        selector.options.length = 0;
    }
}

// 下拉框联动，即模块号选择后，控制显示哪些子模块号
function selectorCouplingEvent(parentSelectorId, childSelectorId, labelid) {
    var value = getSelectedValue(parentSelectorId);
    var subModeSelector = document.getElementById(childSelectorId);
    if (value == '7669') {
        if (subModeSelector) {
            subModeSelector.appendChild(createOption('国内酒店预订', 0));
            subModeSelector.appendChild(createOption('海外酒店预订', 1));
            subModeSelector.appendChild(createOption('系统外预订', 2));

            subModeSelector.disabled = false;
            setLabelForeColor(labelid, 'black');
        }
    } else {
        if (subModeSelector) {
            clearOptions(childSelectorId);
            subModeSelector.disabled = true;
            setLabelForeColor(labelid, 'gray');
        }
    }
}

// 设置标签的颜色
function setLabelForeColor(labelid, color) {
    var label = document.getElementById(labelid);
    if (label) {
        label.style.color = color;
    }
}

// 手动触发控件事件
function fireEvents(fireControll, events, eventType) {
    if (fireControll) {
        var evObj = document.createEvent(events);
        evObj.initEvent(eventType, true, false);
        fireControll.dispatchEvent(evObj);
    }
}