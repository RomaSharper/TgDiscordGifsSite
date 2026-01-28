// js/select.js - Custom select implementation
class CustomSelect {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.options = options;
        this.selectHeader = this.container.querySelector('.select-header');
        this.selectDropdown = this.container.querySelector('.select-dropdown');
        this.selectOptions = this.container.querySelector('.select-options');
        this.selectSearch = this.container.querySelector('.select-search input');
        this.selectedTags = document.getElementById('selected-tags');
        this.hiddenInput = document.getElementById('custom-subject');

        this.isMultiple = options.multiple || false;
        this.isSearchable = options.searchable || true;
        this.placeholder = options.placeholder || 'Выберите вариант';
        this.selectedValues = [];
        this.allOptions = [];

        this.init();
    }

    init() {
        this.setupOptions();
        this.bindEvents();
        this.updateHeader();
    }

    setupOptions() {
        const defaultOptions = [
            { value: 'support', label: 'Техническая поддержка', icon: 'fas fa-tools' },
            { value: 'bug', label: 'Сообщить об ошибке', icon: 'fas fa-bug' },
            { value: 'feature', label: 'Предложить функцию', icon: 'fas fa-lightbulb' },
            { value: 'billing', label: 'Вопросы по оплате', icon: 'fas fa-credit-card' },
            { value: 'api', label: 'API и интеграции', icon: 'fas fa-code' },
            { value: 'privacy', label: 'Конфиденциальность', icon: 'fas fa-shield-alt' },
            { value: 'other', label: 'Другое', icon: 'fas fa-question-circle' }
        ];

        this.allOptions = this.options.items || defaultOptions;
        this.renderOptions(this.allOptions);
    }

    renderOptions(options) {
        this.selectOptions.innerHTML = '';

        if (options.length === 0) {
            this.selectOptions.innerHTML = `
                <div class="select-empty">
                    <i class="fas fa-search"></i>
                    <p>Ничего не найдено</p>
                </div>
            `;
            return;
        }

        options.forEach(option => {
            const isSelected = this.selectedValues.includes(option.value);
            const optionElement = document.createElement('div');
            optionElement.className = `select-option ${isSelected ? 'selected' : ''}`;
            optionElement.dataset.value = option.value;

            optionElement.innerHTML = `
                <div class="option-text">
                    ${option.icon ? `<i class="${option.icon} option-icon"></i>` : ''}
                    <span>${option.label}</span>
                    ${option.badge ? `<span class="option-badge">${option.badge}</span>` : ''}
                </div>
                ${isSelected ? '<i class="fas fa-check"></i>' : ''}
            `;

            optionElement.addEventListener('click', () => this.toggleOption(option.value, option.label));
            this.selectOptions.appendChild(optionElement);
        });
    }

    toggleOption(value, label) {
        if (this.isMultiple) {
            const index = this.selectedValues.indexOf(value);
            if (index > -1) {
                this.selectedValues.splice(index, 1);
            } else {
                this.selectedValues.push(value);
            }
            this.updateSelectedTags();
        } else {
            this.selectedValues = [value];
            this.closeDropdown();
        }

        this.updateOptions();
        this.updateHiddenInput();
        this.updateHeader();

        // Dispatch change event
        this.container.dispatchEvent(new CustomEvent('change', {
            detail: { values: this.selectedValues }
        }));
    }

    updateSelectedTags() {
        if (!this.selectedTags) return;

        this.selectedTags.innerHTML = '';

        this.selectedValues.forEach(value => {
            const option = this.allOptions.find(opt => opt.value === value);
            if (!option) return;

            const tag = document.createElement('div');
            tag.className = 'selected-tag';
            tag.innerHTML = `
                ${option.label}
                <button type="button" data-value="${value}">
                    <i class="fas fa-times"></i>
                </button>
            `;

            tag.querySelector('button').addEventListener('click', (e) => {
                e.stopPropagation();
                this.removeOption(value);
            });

            this.selectedTags.appendChild(tag);
        });
    }

    removeOption(value) {
        const index = this.selectedValues.indexOf(value);
        if (index > -1) {
            this.selectedValues.splice(index, 1);
            this.updateOptions();
            this.updateHiddenInput();
            this.updateHeader();
            this.updateSelectedTags();

            this.container.dispatchEvent(new CustomEvent('change', {
                detail: { values: this.selectedValues }
            }));
        }
    }

    updateOptions() {
        const options = this.selectOptions.querySelectorAll('.select-option');
        options.forEach(option => {
            const value = option.dataset.value;
            option.classList.toggle('selected', this.selectedValues.includes(value));

            const checkIcon = option.querySelector('.fa-check');
            if (checkIcon) {
                checkIcon.style.display = this.selectedValues.includes(value) ? 'inline-block' : 'none';
            } else if (this.selectedValues.includes(value)) {
                option.innerHTML += '<i class="fas fa-check"></i>';
            }
        });
    }

    updateHiddenInput() {
        if (this.hiddenInput) {
            this.hiddenInput.value = this.selectedValues.join(',');
        }
    }

    updateHeader() {
        const placeholder = this.selectHeader.querySelector('.select-placeholder');
        const valueDisplay = this.selectHeader.querySelector('.select-value');

        if (this.selectedValues.length === 0) {
            if (placeholder) placeholder.style.display = 'block';
            if (valueDisplay) valueDisplay.style.display = 'none';
        } else {
            if (placeholder) placeholder.style.display = 'none';

            if (!valueDisplay) {
                const newValueDisplay = document.createElement('span');
                newValueDisplay.className = 'select-value';
                this.selectHeader.insertBefore(newValueDisplay, this.selectHeader.querySelector('i'));
                this.updateValueDisplay();
            } else {
                this.updateValueDisplay();
            }
        }
    }

    updateValueDisplay() {
        const valueDisplay = this.selectHeader.querySelector('.select-value');
        if (!valueDisplay) return;

        valueDisplay.style.display = 'flex';

        if (this.isMultiple) {
            const selectedOptions = this.selectedValues.map(value => {
                const option = this.allOptions.find(opt => opt.value === value);
                return option ? option.label : value;
            });

            if (selectedOptions.length <= 2) {
                valueDisplay.textContent = selectedOptions.join(', ');
            } else {
                valueDisplay.textContent = `${selectedOptions[0]}, ${selectedOptions[1]} (+${selectedOptions.length - 2})`;
            }
        } else {
            const selectedOption = this.allOptions.find(opt => opt.value === this.selectedValues[0]);
            valueDisplay.textContent = selectedOption ? selectedOption.label : this.selectedValues[0];
        }
    }

    bindEvents() {
        // Toggle dropdown
        this.selectHeader.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleDropdown();
        });

        // Search functionality
        if (this.selectSearch && this.isSearchable) {
            this.selectSearch.addEventListener('input', (e) => {
                this.filterOptions(e.target.value);
            });
        }

        // Close dropdown on outside click
        document.addEventListener('click', (e) => {
            if (!this.container.contains(e.target)) {
                this.closeDropdown();
            }
        });

        // Close on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.selectDropdown.classList.contains('show')) {
                this.closeDropdown();
            }
        });

        // Custom button click
        const customBtn = this.container.querySelector('.select-custom-btn');
        if (customBtn) {
            customBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.openCustomOptionModal();
            });
        }
    }

    toggleDropdown() {
        if (this.selectDropdown.classList.contains('show')) {
            this.closeDropdown();
        } else {
            this.openDropdown();
        }
    }

    openDropdown() {
        this.selectDropdown.classList.add('show');
        this.selectHeader.classList.add('open');

        if (this.selectSearch) {
            setTimeout(() => {
                this.selectSearch.focus();
            }, 100);
        }
    }

    closeDropdown() {
        this.selectDropdown.classList.remove('show');
        this.selectHeader.classList.remove('open');

        if (this.selectSearch) {
            this.selectSearch.value = '';
            this.filterOptions('');
        }
    }

    filterOptions(searchTerm) {
        const filtered = this.allOptions.filter(option =>
            option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
            option.value.toLowerCase().includes(searchTerm.toLowerCase())
        );
        this.renderOptions(filtered);
    }

    openCustomOptionModal() {
        this.closeDropdown();

        const customOption = prompt('Введите название новой темы:');
        if (customOption && customOption.trim()) {
            const newOption = {
                value: 'custom_' + Date.now(),
                label: customOption.trim(),
                icon: 'fas fa-plus'
            };

            this.allOptions.push(newOption);
            this.toggleOption(newOption.value, newOption.label);
        }
    }

    getSelectedValues() {
        return this.selectedValues;
    }

    getSelectedLabels() {
        return this.selectedValues.map(value => {
            const option = this.allOptions.find(opt => opt.value === value);
            return option ? option.label : value;
        });
    }

    clear() {
        this.selectedValues = [];
        this.updateOptions();
        this.updateHiddenInput();
        this.updateHeader();
        this.updateSelectedTags();
    }
}

// Initialize custom select when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    const customSelect = new CustomSelect('custom-select-container', {
        multiple: false,
        searchable: true,
        placeholder: 'Выберите тему сообщения'
    });

    // Make it available globally
    window.CustomSelect = customSelect;
});
