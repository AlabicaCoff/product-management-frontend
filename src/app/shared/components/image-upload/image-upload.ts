import { Component, ElementRef, ViewChild, signal } from '@angular/core';

@Component({
  selector: 'app-image-upload',
  imports: [],
  templateUrl: './image-upload.html',
  styleUrl: './image-upload.css',
})
export class ImageUpload {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  // Variable
  previewUrl = signal<string | null>(null);
  selectedFile = signal<File | null>(null);

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
      };

      reader.readAsDataURL(file);
    }
  }

  clearSelection(): void {
    // 4. Reset the signals
    this.previewUrl.set(null);
    this.selectedFile.set(null);
  }
}
