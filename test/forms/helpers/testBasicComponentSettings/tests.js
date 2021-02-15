import assert from 'power-assert';
import _ from 'lodash';
import settings from './settings';
import values from './values';

export default {
  placeholder: {
    'Should show placeholder'(form, done) {
      form.components.forEach(comp=> {
        const compKey = comp.component.key;
        const compType = comp.component.type;
        const compInput = comp.element.querySelector(`[name="data[${compKey}]"]`);

        let renderedPlaceholder;
        let expectedPlaceholder;

        if (compType === 'day') {
          _.each(comp.component.fields, (fieldSettings, fieldName) => {
            if (fieldSettings.type === 'number') {
              renderedPlaceholder = comp.refs[fieldName].placeholder;
            }
            if (fieldSettings.type === 'select') {
              renderedPlaceholder = comp.refs[fieldName][0].textContent;
            }

            expectedPlaceholder = fieldSettings.placeholder;

            assert.equal(renderedPlaceholder.trim() , expectedPlaceholder.trim(), `Should show placeholder for ${fieldName} in ${compKey} (component ${compType})`)
          })
        }
        else {
          renderedPlaceholder = compType === 'select' ? compInput.attributes.placeholder.value : compInput.placeholder;
          expectedPlaceholder = comp.component.placeholder;
          assert.equal( renderedPlaceholder,expectedPlaceholder , `Should show placeholder for ${compKey} (component ${compType})`)
        }
      });
      done();
    },
  },
  description: {
    'Should show description'(form, done) {
      form.components.forEach(comp=> {
        const compKey = comp.component.key;
        const compType = comp.component.type;
        const compDescription = comp.element.querySelector(`.text-muted`).textContent;

        assert.equal(compDescription, comp.component.description, `Should show description for ${compKey} (component ${compType})`)
      })
      done();
    },
  },
  tooltip:{
    'Should render tooltip icon and show tooltip description on click'(form, done) {
      form.components.forEach((comp, index) => {
        const isLastComp = index === (form.components.length - 1);
        const compKey = comp.component.key;
        const compType = comp.component.type;
        const clickEvent = new Event('click');

        assert.equal(comp.tooltips.length, 1, `${compKey} (component ${compType}): should contain tooltip objects`);
  
        const tooltipIcon = comp.refs.tooltip[0];
  
        assert.equal(!!tooltipIcon, true, `${compKey} (component ${compType}): should contain ref to tooltip icon`);

        tooltipIcon.dispatchEvent(clickEvent);

        setTimeout(() => {
          const tooltipText = comp.element.querySelector('.tooltip-inner').textContent.trim();

          assert.equal(tooltipText, comp.component.tooltip.trim(), `Should show tooltip for ${compKey} (component ${compType})`);
          
          if (isLastComp) {
            done();
          }
        });
      });
    }
  }, 
  prefix: {
    'Should show prefix'(form, done) {
      form.components.forEach(comp=> {
        const compKey = comp.component.key;
        const compType = comp.component.type;

        assert.equal(comp.refs.prefix[0].textContent.trim(), comp.component.prefix, `Should show prefix for ${compKey} (component ${compType})`);
      })
      done();
    },
  },
  suffix: {
    'Should show suffix'(form, done) {
      form.components.forEach(comp=> {
        const compKey = comp.component.key;
        const compType = comp.component.type;

        assert.equal(comp.refs.suffix[0].textContent.trim(), comp.component.suffix, `Should show suffix for ${compKey} (component ${compType})`)
      })
      done();
    },
  },
  customClass:{
    'Should set custom css class'(form, done) {
      form.components.forEach(comp=> {
        const compKey = comp.component.key;
        const compType = comp.component.type;
        
        assert.equal(comp.element.classList.contains(comp.component.customClass), true, `Should set custom class for ${compKey} (component ${compType})`)
      })
      done();
    },
  },
  tabindex: {
    'Should set tabindex'(form, done) {
      form.components.forEach(comp=> {
        const compKey = comp.component.key;
        const compType = comp.component.type;
        let tabInput;

        switch(comp.component.type){
          case 'address':
            tabInput = comp.refs.searchInput[0].tabIndex;
            break;
          case 'button':
            tabInput = comp.refs.button.tabIndex;
            break;
          case 'select':
            tabInput = comp.element.querySelector('.selection').tabIndex;
            break;
          default:
            tabInput = comp.refs.input[0].tabIndex;
        }

        assert.equal(tabInput, comp.component.tabindex, `Should set tab index for ${compKey} (component ${compType})`);
      });

      done();
    },
  },
  hidden: {
    'Should not render hidden component'(form, done) {
      form.components.forEach(comp=> {
        const compKey = comp.component.key;
        const compType = comp.component.type;

        assert.equal(comp.visible, false, `Should set visible:false for ${compKey} (component ${compType})`);
        if (compType !== 'well') {
          assert.equal(comp.element.classList.contains('formio-hidden'), true, `Should set formio-hidden class for ${compKey} (component ${compType})`);
        }
      })
      done();
    },
  },
  hideLabel:{
    'Should hide component label'(form, done) {
      form.components.forEach(comp=> {
        const compKey = comp.component.key;
        const compType = comp.component.type;
        let label;

        switch(comp.component.type){
          case 'checkbox':
            label = comp.element.querySelector('.form-check-label').children[1];
            break;
          case 'panel':
            label = comp.element.querySelector('.card-title');
            break;
          default:
            label = comp.element.querySelector(`label[for="${comp.id}-${compKey}"]`);
        }

        assert.equal(!!label, false, `Should hide label for ${compKey} (component ${compType})`);
      })
      done();
    },
  },
  disabled:{
    'Should disable components'(form, done) {
      form.components.forEach(comp=> {
        const compType = comp.component.type;

        const checkDisabled = (component, child) => {
          const componentType = component.component.type;
          const componentKey = component.component.key;
          const disabled = _.isBoolean(component.disabled) ? component.disabled : component._disabled;

          assert.equal(
            disabled, 
            true, 
            !child 
              ? `Should set disabled:true for ${componentKey} (component ${componentType})`
              : `Should set disabled:true for ${componentType} inside ${compType} component`
            );

          const compInput = component.element.querySelector(`[name="data[${componentKey}]"]`);
          let compInputs = [];

          if (componentType === 'day') {
            compInputs = Object.keys(component.component.fields).map(fieldName => {
              return component.element.querySelector(`[ref="${fieldName}"]`)
            })
          }

          if (compInput || compInputs.length) {

            const inputs = compInput ? [compInput] : compInputs;
            _.each(inputs, (input) => {
              assert.equal(
                input.disabled, 
                true, 
                !child 
                  ? `Should disable component input for ${componentKey} (component ${componentType})`
                  : `Should disable component input for ${componentType} inside ${compType} component`
              );
            });
          }
        }

        checkDisabled(comp, false);

        if (_.isArray(comp.components)) {
          _.each(comp.components, (childComp) => {
            checkDisabled(childComp, true);
          })
        }
      });

      done();
    },
  },
  defaultValue: {
    'Should set default value'(form, done) {
      form.components.forEach(comp=> {
        const compKey = comp.component.key;
        const compType = comp.component.type;
        const defaultValue = comp.component.defaultValue;

        assert.deepEqual(comp.defaultValue, defaultValue, `Should correctly define default value for ${compKey} (component ${compType})`);
        assert.deepEqual(comp.dataValue, comp.defaultValue, `Should set default value for ${compKey} (component ${compType})`);

        const inputValue = comp.getValue();

        assert.deepEqual(
          compType === 'datetime' ? inputValue.startsWith(comp.defaultValue) : inputValue, 
          compType === 'datetime' ? true : comp.defaultValue, 
          `Got value must be equal to default value for ${compKey} (component ${compType})`);
      })
      done();
    },
  },
  customDefaultValue: {
    'Should correctly set custom default value'(form, done) {
      form.components.forEach(comp=> {
        const compKey = comp.component.key;
        const compType = comp.component.type;
        if(compKey === 'basis') return;
      
        const defaultValue = settings.customDefaultValue[`${compKey}`].expectedValue;

        assert.deepEqual(comp.defaultValue, defaultValue, `Should correctly define default value for ${compKey} (component ${compType})`);
        assert.deepEqual(comp.dataValue, comp.defaultValue, `Should set default value for ${compKey} (component ${compType})`);

        const inputValue = comp.getValue();

        assert.deepEqual(
          compType === 'datetime' ? inputValue.startsWith(comp.defaultValue) : inputValue, 
          compType === 'datetime' ? true : comp.defaultValue, 
          `Got value must be equal to default value for ${compKey} (component ${compType})`
        );
      })
      done();
    },
  },
  customDefaultValue: {
    'Should correctly set custom default value'(form, done) {
      form.components.forEach(comp=> {
        const compKey = comp.component.key;
        const compType = comp.component.type;
        if(compKey === 'basis') return;
      
        const defaultValue = settings.customDefaultValue[`${compKey}`].expectedValue;

        assert.deepEqual(comp.defaultValue, defaultValue, `Should correctly define default value for ${compKey} (component ${compType})`);
        assert.deepEqual(comp.dataValue, comp.defaultValue, `Should set default value for ${compKey} (component ${compType})`);

        const inputValue = comp.getValue();

        assert.deepEqual(
          compType === 'datetime' ? inputValue.startsWith(comp.defaultValue) : inputValue, 
          compType === 'datetime' ? true : comp.defaultValue, 
          `Got value must be equal to default value for ${compKey} (component ${compType})`
        );
      })
      done();
    },
  },
  redrawOn: {
    'Should redrow on checkbox value change'(form, done) {
      const checkboxValue =  form.data.checkbox;

      assert.deepEqual(checkboxValue, false, `Should set checkbox value to false`);

      form.components.forEach(comp=> {
        const compKey = comp.component.key;
        const compType = comp.component.type;
        
        assert.deepEqual(comp.name.trim().endsWith(checkboxValue.toString()), true, `Should interpolate label using checkbox data for ${compKey} (component ${compType})`);
      });

      form.getComponent('checkbox').setValue(true);

      setTimeout(() => {
        const changedCheckboxValue = form.data.checkbox;

        assert.deepEqual (changedCheckboxValue, true, `Should change checkbox value to true`);
        form.components.forEach(comp=> {
          const compKey = comp.component.key;
          const compType = comp.component.type;

          assert.deepEqual(comp.name.trim().endsWith(changedCheckboxValue.toString()), true, `${compKey} (component ${compType}): should change interpolated label text based on new checkbox value`);
        });

        done();
      })
    },
  },  
  multiple: {
    'Should render component in multiple mode and able to add/remove value'(form, done) {
      const testComponents = form.components.filter(comp => !['select', 'file'].includes(comp.component.type));

      testComponents.forEach((comp, index) => {
        const isLastComp = index === (testComponents.length - 1);
        const compKey = comp.component.key;
        const compType = comp.component.type;

        const clickEvent = new Event('click');

        const addAnotherBtn = comp.refs.addButton[0] || comp.refs.addButton;
        const removeRowBtns = comp.refs.removeRow;
        const componentInputs = comp.refs.input || comp.refs.searchInput;

        assert.deepEqual(!!addAnotherBtn, true, `${compKey} (component ${compType}): should show addAnother button in multiple mode `);
        assert.deepEqual(removeRowBtns.length, 1, `${compKey} (component ${compType}): should have remove row button in multiple mode `);
        assert.deepEqual(componentInputs.length, 1, `${compKey} (component ${compType}): should render component input in multiple mode `);

        addAnotherBtn.dispatchEvent(clickEvent);

        setTimeout(() => {
          const removeRowBtnsAfterAddingValue = comp.refs.removeRow;
          const componentInputsAfterAddingValue = comp.refs.input || comp.refs.searchInput;

          assert.deepEqual(removeRowBtnsAfterAddingValue.length, 2, `${compKey} (component ${compType}): should add remove value row btn for new row in multiple mode `);
          assert.deepEqual(componentInputsAfterAddingValue.length, 2, `${compKey} (component ${compType}): should add new row in multiple mode `);
          removeRowBtnsAfterAddingValue[0].dispatchEvent(clickEvent);

          setTimeout(() => {
              const removeRowBtnsAfterRemovingValue = comp.refs.removeRow;
            const componentInputsAfterRemovingValue = comp.refs.input || comp.refs.searchInput;

            assert.deepEqual(removeRowBtnsAfterRemovingValue.length, 1, `${compKey} (component ${compType}): should remove 'remove value row btn' if row is removed in multiple mode `);
            assert.deepEqual(componentInputsAfterRemovingValue.length, 1, `${compKey} (component ${compType}): should add remove row in multiple mode`);

            if (isLastComp) {
               done();
            }
          })
        })
      });
    },
    'Should set multiple values'(form, done) {
      form.components.forEach((comp, index) => {
        const isLastComp = index === (form.components.length - 1);
        const compKey = comp.component.key;
        const compType = comp.component.type;
        const value = values.multipleValues[compKey];

        comp.setValue(value);

          setTimeout(() => {
            const removeRowBtns = comp.refs.removeRow;

            assert.deepEqual(comp.getValue().length, value.length, `${compKey} (component ${compType}): should set multiple values`);
            
            assert.deepEqual(
              comp.type === 'datetime' ? comp.getValue().every((val, ind) => val.startsWith(value[ind])) : comp.getValue(), 
              comp.type === 'datetime' ? true : value, 
              `${compKey} (component ${compType}): set and get values must be equal in multiple mode`
            );

            if(!['select', 'file'].includes(compType)) {
              const componentInputs = comp.refs.input || comp.refs.searchInput;
              assert.deepEqual(componentInputs.length, value.length, `${compKey} (component ${compType}): should render multiple inputs`);
              assert.deepEqual(removeRowBtns.length, value.length, `${compKey} (component ${compType}): should add remove btn for each row in multiple mode`);
            }

            if (compType === 'file') {
              assert.deepEqual(comp.refs.fileLink.length, value.length, `${compKey} (component ${compType}): should render multiple file links`);
              assert.deepEqual(comp.refs.removeLink.length, value.length, `${compKey} (component ${compType}): should add remove link btn for each link in multiple mode`);
            }

            if (isLastComp) {
              done();
            }
          });
      });
    },
  },
  modalEdit: {
    'Should open and close modal window'(form, done) {
      const componentsWithBug = ["columns", "fieldset", "panel", "table", "tabs", "well"]; //BUG: include them in test when it is fixed
      const testComponents = form.components.filter(comp => !componentsWithBug.includes(comp.component.type));
      testComponents.forEach((comp, index) => {
        const isLastComp = index === (testComponents.length - 1);
        const compKey = comp.component.key;
        const compType = comp.component.type;
        const clickEvent = new Event('click');

        const isModalWindowOpened = () => {
          return !comp.refs.modalWrapper.classList.contains('component-rendering-hidden');
        }

        assert.deepEqual(isModalWindowOpened(comp), false, `${compKey} (component ${compType}): should keep modal window closed after setting form`);

        const openModalBtn = comp.refs.openModal;
        openModalBtn.dispatchEvent(clickEvent);

        setTimeout(() => {
          assert.deepEqual(isModalWindowOpened(comp), true, `${compKey} (component ${compType}): should open modal window`);

          const closeModalBtn = comp.componentModal.refs.modalClose;
          closeModalBtn.dispatchEvent(clickEvent);

          setTimeout(() => {
            assert.deepEqual(isModalWindowOpened(comp), false, `${compKey} (component ${compType}): should close modal window`);

            if (isLastComp) {
              done();
            }
          })
        })
      });
    },
    'Should delete component changes when closing modal window and clicking "delete it" in confirmation dialog' (form, done) {
      const layoutComponents = ["columns", "fieldset", "panel", "table", "tabs", "well"]
      const testComponents = form.components.filter(comp => !['htmlelement', 'content'].includes(comp.component.type));

      testComponents.forEach((comp, index) => {
        const componentsWithBug = layoutComponents; //BUG: include them in test when it is fixed
        const isLastComp = index === (testComponents.length - 1);
        const compKey = comp.component.key;
        const compType = comp.component.type;

        const clickEvent = new Event('click');
        const isModalWindowOpened = () => {
          return !comp.refs.modalWrapper.classList.contains('component-rendering-hidden');
        }
        
        const openModalBtn = comp.refs.openModal;
        openModalBtn.dispatchEvent(clickEvent);

        setTimeout(() => {
          assert.deepEqual(isModalWindowOpened(), true, `${compKey} (component ${compType}): should open modal window`);

          const initialValue = _.cloneDeep(comp.getValue());
          const value = values.values[compKey];

          comp.setValue(value);

          setTimeout(() => {
            if (layoutComponents.includes(compType)) {
              _.each(comp.components, (child) => {
                const childType = child.component.type;
                const childKey = child.component.key;
                const childDataValue = child.getValue();
                const childExpectedValue = comp.getValue()[childKey];

                assert.deepEqual(
                  childType === 'datetime' ? childDataValue.startsWith(childExpectedValue) : childDataValue, 
                  childType === 'datetime' ? true : childExpectedValue, 
                  `${compKey} (component ${compType}): should set value in modalEdit mode`
                );
              })
            }
            else {
              assert.deepEqual(
                compType === 'datetime' ? comp.getValue().startsWith(value) : comp.getValue(), 
                compType === 'datetime' ? true : value, 
                `${compKey} (component ${compType}): should set value in modalEdit mode`
              );
            }

            const closeModalBtn = comp.refs.modalClose;

            closeModalBtn.dispatchEvent(clickEvent);
 
            setTimeout(() => {
              const confirmationDialog = document.querySelector('.formio-dialog-content[ref="dialogContents"]');
              assert.deepEqual(!!confirmationDialog, true, `${compKey} (component ${compType}): should open confirmation dialog`);

              const clearChangesBtn = confirmationDialog.querySelector('[ref="dialogYesButton"]');
              clearChangesBtn.dispatchEvent(clickEvent);

              setTimeout(() => {
                const confirmationDialogAfter = document.querySelector('.formio-dialog-content[ref="dialogContents"]');
                assert.deepEqual(!!confirmationDialogAfter, false, `${compKey} (component ${compType}): should close confirmation dialog`);

                if (!componentsWithBug.includes(compType)) {
                  assert.deepEqual(comp.getValue(), initialValue, `${compKey} (component ${compType}): should clear value in modalEdit mode`);
                }

                assert.deepEqual(isModalWindowOpened(), false, `${compKey} (component ${compType}): should close modal window`);
   
                if (isLastComp) {
                  done();
                }
              }, 50)
            }, 50)
          }, 50)
        })
      });
    },
    'Should save component values and close the modal after clicking "save"' (form, done) {
      const layoutComponents = ["columns", "fieldset", "panel", "table", "tabs", "well"]
      const testComponents = form.components.filter(comp => !['htmlelement', 'content'].includes(comp.component.type));

      testComponents.forEach((comp, index) => {
        //const componentsWithBug = layoutComponents; //BUG: include them in test when it is fixed
        const isLastComp = index === (testComponents.length - 1);
        const compKey = comp.component.key;
        const compType = comp.component.type;

        const clickEvent = new Event('click');
        const isModalWindowOpened = () => {
          return !comp.refs.modalWrapper.classList.contains('component-rendering-hidden');
        }
        
        const openModalBtn = comp.refs.openModal;
        openModalBtn.dispatchEvent(clickEvent);

        setTimeout(() => {
          assert.deepEqual(isModalWindowOpened(), true, `${compKey} (component ${compType}): should open modal window`);

          const value = values.values[compKey];
          comp.setValue(value);

          setTimeout(() => {
            const saveModalBtn = comp.refs.modalSave;
            saveModalBtn.dispatchEvent(clickEvent);
 
            setTimeout(() => {
              assert.deepEqual(isModalWindowOpened(), false, `${compKey} (component ${compType}): should close modal window`);

              if (layoutComponents.includes(compType)) {
                _.each(comp.components, (child) => {
                  const childType = child.component.type;
                  const childKey = child.component.key;
                  const childDataValue = child.getValue();
                  const childExpectedValue = comp.getValue()[childKey];

                  assert.deepEqual(
                    childType === 'datetime' ? childDataValue.startsWith(childExpectedValue) : childDataValue, 
                    childType === 'datetime' ? true : childExpectedValue, 
                    `${compKey} (component ${compType}): should save value in modalEdit mode`
                  );
                })
              }
              else {
                assert.deepEqual(
                  compType === 'datetime' ? comp.getValue().startsWith(value) : comp.getValue(), 
                  compType === 'datetime' ? true : value, 
                  `${compKey} (component ${compType}): should save value in modalEdit mode`
                );
              }

              if (isLastComp) {
                done();
              }
            }, 50)
          }, 50)
        })
      });
    },
  },
};
