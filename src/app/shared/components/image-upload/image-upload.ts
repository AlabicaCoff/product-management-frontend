import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, signal, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-image-upload',
  imports: [],
  templateUrl: './image-upload.html',
  styleUrl: './image-upload.css',
})
export class ImageUpload implements OnChanges {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  @Input() existingImageUrl?: string;

  @Output() imageUploadEvent = new EventEmitter<File | null>();

  // Variable
  previewUrl = signal<string | null>(null);
  selectedFile = signal<File | null>(null);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['existingImageUrl']) {
      if (!this.selectedFile()) {
        this.previewUrl.set(this.existingImageUrl || null);
      }
    }
  }

  triggerFileInput(): void {
    if (this.fileInput) {
      this.fileInput.nativeElement.click();
    }
  }

  // Method
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      // 2. Update the selected file signal
      this.selectedFile.set(file);

      const reader = new FileReader();
      
      reader.onload = (e: ProgressEvent<FileReader>) => {
        // 3. Update the preview URL signal when the file is read
        this.previewUrl.set(e.target?.result as string);
        this.imageUploadEvent.emit(file);
      };

      reader.readAsDataURL(file);
    }
  }

  clearSelection(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    // 4. Reset the signals
    this.previewUrl.set(null);
    this.selectedFile.set(null);
    this.imageUploadEvent.emit(null);
    
    // Clear the input value so the same file can be selected again
    if (this.fileInput && this.fileInput.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
  }
}
