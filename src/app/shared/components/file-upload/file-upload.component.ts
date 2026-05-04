import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [],
  template: `
    <div
      class="upload-zone p-5 text-center border rounded"
      [class.drag-over]="isDragging"
      (dragover)="onDragOver($event)"
      (dragleave)="onDragLeave($event)"
      (drop)="onDrop($event)"
      (click)="fileInput.click()"
    >
      <div class="icon-lg text-primary mb-3">📁</div>
      <h5>Drag & Drop your file here</h5>
      <p class="text-muted small">or click to browse from your computer (PDF/DOCX max 5MB)</p>

      <input
        #fileInput
        type="file"
        class="d-none"
        (change)="onFileSelect($event)"
        accept=".pdf,.doc,.docx"
      />

      @if (selectedFile) {
        <div
          class="mt-3 p-2 bg-secondary rounded d-flex justify-content-between align-items-center mx-auto"
          style="max-width: 300px;"
        >
          <span class="text-truncate fw-500">{{ selectedFile.name }}</span>
          <button type="button" class="btn btn-sm text-danger" (click)="clearFile($event)">
            &times;
          </button>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .upload-zone {
        border: 2px dashed var(--border-color) !important;
        background-color: var(--qt-bg-secondary);
        transition: all 0.3s ease;
        cursor: pointer;
      }
      .upload-zone.drag-over {
        border-color: var(--qt-orange) !important;
        background-color: rgba(232, 106, 45, 0.05);
      }
      .icon-lg {
        font-size: 3rem;
      }
      .text-primary {
        color: var(--qt-navy);
      }
      .d-none {
        display: none;
      }
      .bg-secondary {
        background-color: #fff;
        border: 1px solid var(--border-color);
      }
      .text-truncate {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 200px;
        display: inline-block;
      }
      .fw-500 {
        font-weight: 500;
      }
    `,
  ],
})
export class FileUploadComponent {
  @Output() fileChanged = new EventEmitter<File | null>();

  isDragging = false;
  selectedFile: File | null = null;

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;

    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.handleFile(event.dataTransfer.files[0]);
    }
  }

  onFileSelect(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.handleFile(event.target.files[0]);
    }
  }

  handleFile(file: File) {
    // Basic validation
    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB');
      return;
    }
    this.selectedFile = file;
    this.fileChanged.emit(file);
  }

  clearFile(event: Event) {
    event.stopPropagation();
    this.selectedFile = null;
    this.fileChanged.emit(null);
  }
}
