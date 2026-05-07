import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
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
export class SelectComponent implements ControlValueAccessor, OnInit, OnChanges {
  @Input() items: SelectItem[] = [];
  @Input() placeholder = 'Seleccione una opción';
  @Input() searchable = false;
  @Input() selectFirst = false;
  @Input() disabled = false;
  @Input() selectAction = false;
  @Input() selectActionName = 'Nombre botón';

  @Output() actionChange = new EventEmitter<SelectItem>();
  @Output() actionClick = new EventEmitter<any>();

  isOpen = false;
  searchTerm = '';
  filteredItems: SelectItem[] = [];
  selectedItem: SelectItem | null = null;

  private pendingValue: any = null;
  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  ngOnInit(): void {
    this.syncItems();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['items']) {
      this.syncItems();
    }
  }

  writeValue(value: any): void {
    this.pendingValue = value;

    if (!value) {
      this.selectedItem = null;
      return;
    }

    const found = this.items.find(i => i.id == value);
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

  toggleDropdown(): void {
    if (this.disabled) return;
    this.isOpen = !this.isOpen;
  }

  selectItem(item: SelectItem): void {
    if (this.disabled) return;
    this.selectedItem = item;
    this.pendingValue = item.id;
    this.isOpen = false;
    this.onChange(item.id);
    this.onTouched();
    this.actionChange.emit(item);
    this.searchTerm = '';
    this.filteredItems = [...this.items];
  }

  onSearchChange(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredItems = this.items.filter(item =>
      item.name.toLowerCase().includes(term)
    );
  }

  triggerAction(): void {
    this.actionClick.emit();
  }

  private syncItems(): void {
    this.filteredItems = [...this.items];

    if (this.pendingValue) {
      const found = this.items.find(i => i.id == this.pendingValue);
      this.selectedItem = found || null;
    }

    if (this.selectFirst && this.items.length > 0 && !this.selectedItem) {
      this.selectItem(this.items[0]);
    }
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.select-container')) {
      this.isOpen = false;
    }
  }
}
