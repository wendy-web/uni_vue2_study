import { VantComponent } from '../common/component';
import { useParent } from '../common/relation';

function emit(target, value, range, currentIndex) {
    target.$emit('input', { value, range, currentIndex });
    target.$emit('change', { value, range, currentIndex });
}
VantComponent({
    field: true,
    relation: useParent('checkbox-group'),
    classes: ['icon-class', 'label-class'],
    props: {
        value: Boolean,
        disabled: Boolean,
        useIconSlot: Boolean,
        checkedColor: String,
        currentIndex: Number,
        labelPosition: {
            type: String,
            value: 'right',
        },
        labelDisabled: Boolean,
        shape: {
            type: String,
            value: 'round',
        },
        iconSize: {
            type: null,
            value: 20,
        },
    },
    data: {
        parentDisabled: false,
        direction: 'vertical',
    },
    methods: {
        emitChange(value, range) {
            if (this.parent) {
                this.setParentValue(this.parent, value, range);
            } else {
                const { currentIndex } = this.data;
                emit(this, value, range, currentIndex);
            }
        },
        toggle(event) {
            const { parentDisabled, disabled, value } = this.data;
            if (!disabled && !parentDisabled) {
                this.emitChange(!value, 'icon');
            }
        },
        onClickLabel(event) {
            const { labelDisabled, parentDisabled, disabled, value } = this.data;
            if (!disabled && !labelDisabled && !parentDisabled) {
                this.emitChange(!value, 'cont');
            }
        },
        setParentValue(parent, value, range) {
            const parentValue = parent.data.value.slice();
            const { name, currentIndex } = this.data;
            const { max } = parent.data;
            if (value) {
                if (max && parentValue.length >= max) {
                    return;
                }
                if (parentValue.indexOf(name) === -1) {
                    parentValue.push(name);
                    emit(parent, parentValue, range, currentIndex);
                }
            } else {
                const index = parentValue.indexOf(name);
                if (index !== -1) {
                    parentValue.splice(index, 1);
                    emit(parent, parentValue, range, currentIndex);
                }
            }
        },
    },
});
