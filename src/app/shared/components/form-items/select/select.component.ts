import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
  forwardRef
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface SelectItem {
  id: any;
  name: string;
  value?: any;
}

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true
    }
  ]
})
export class SelectComponent implements ControlValueAccessor {
  @Input() items: SelectItem[] = [];
  @Input() placeholder = 'Seleccione una opción';
  @Input() searchable = false;
  @Input() selectFirst = false;
  @Input() disabled = false;

  @Output() change = new EventEmitter<SelectItem>();
  @Output() click = new EventEmitter<void>();

  isOpen = false;
  searchTerm = '';
  filteredItems: SelectItem[] = [];
  selectedItem: SelectItem | null = null;

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  ngOnInit() {
    this.filteredItems = [...this.items];

    // Si no hay valor inicial y está activado selectFirst, selecciona el primero
    if (this.selectFirst && this.items.length > 0 && !this.selectedItem) {
      this.selectItem(this.items[0]);
    }
  }

  writeValue(value: any): void {
    if (!value) {
      this.selectedItem = null;
      return;
    }
    const found = this.items.find(i => i.id === value);
    if (found) this.selectedItem = found;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  toggleDropdown() {
    if (this.disabled) return;
    this.isOpen = !this.isOpen;
  }

  selectItem(item: SelectItem) {
    if (this.disabled) return;
    this.selectedItem = item;
    this.isOpen = false;
    this.onChange(item.id);
    this.onTouched();
    this.change.emit(item);
    this.searchTerm = '';
    this.filteredItems = [...this.items];
  }

  onSearchChange() {
    const term = this.searchTerm.toLowerCase();
    this.filteredItems = this.items.filter(item =>
      item.name.toLowerCase().includes(term)
    );
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.select-container')) {
      this.isOpen = false;
    }
  }
}
