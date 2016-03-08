// ����ļ������˹���������ĸ��ַ���

// ��ȡ������ĵ�ǰѡ��ֵ
function getSelectedValue(selectorid) {
    var selector = document.getElementById(selectorid);
    if (selector &&
        selector.children.length > 0 &&
        selector.children[selector.selectedIndex] != null) {
        return selector.children[selector.selectedIndex].value;
    }
    else return '';
}

// �����������ֵ
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

// ����������
function createOption(text, value) {
    var oOption = document.createElement("OPTION");
    oOption.text = text;
    oOption.value = value;
    return oOption;
}

// ��������������ѡ��
function clearOptions(selectorid) {
    var selector = document.getElementById(selectorid);
    if (selector) {
        selector.options.length = 0;
    }
}

// ��������������ģ���ѡ��󣬿�����ʾ��Щ��ģ���
function selectorCouplingEvent(parentSelectorId, childSelectorId, labelid) {
    var value = getSelectedValue(parentSelectorId);
    var subModeSelector = document.getElementById(childSelectorId);
    if (value == '7669') {
        if (subModeSelector) {
            subModeSelector.appendChild(createOption('���ھƵ�Ԥ��', 0));
            subModeSelector.appendChild(createOption('����Ƶ�Ԥ��', 1));
            subModeSelector.appendChild(createOption('ϵͳ��Ԥ��', 2));

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

// ���ñ�ǩ����ɫ
function setLabelForeColor(labelid, color) {
    var label = document.getElementById(labelid);
    if (label) {
        label.style.color = color;
    }
}

// �ֶ������ؼ��¼�
function fireEvents(fireControll, events, eventType) {
    if (fireControll) {
        var evObj = document.createEvent(events);
        evObj.initEvent(eventType, true, false);
        fireControll.dispatchEvent(evObj);
    }
}