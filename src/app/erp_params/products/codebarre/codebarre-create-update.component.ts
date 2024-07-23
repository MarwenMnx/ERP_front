import {
  AfterViewInit,
  Component,
  DestroyRef,
  Inject,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { Observable, of, ReplaySubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TableColumn } from '@vex/interfaces/table-column.interface';

import { SelectionModel } from '@angular/cdk/collections';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { stagger40ms } from '@vex/animations/stagger.animation';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormControl,
  Validators
} from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { VexPageLayoutContentDirective } from '@vex/components/vex-page-layout/vex-page-layout-content.directive';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { VexBreadcrumbsComponent } from '@vex/components/vex-breadcrumbs/vex-breadcrumbs.component';
import { VexPageLayoutHeaderDirective } from '@vex/components/vex-page-layout/vex-page-layout-header.directive';
import { VexPageLayoutComponent } from '@vex/components/vex-page-layout/vex-page-layout.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { CodeBarreTable } from '../models/codeBarre.model';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { EventEmitter } from 'stream';



@Component({
  selector: 'vex-code-barre-create-update',
  template: `
    <form (ngSubmit)="save()" [formGroup]="form">
      <div class="flex items-center" mat-dialog-title>
          
          <h2
            *ngIf="form.controls.libelleColi.value"
            class="headline m-0 flex-auto">
            {{ form.controls.libelleColi.value }}
          </h2>
          <h2
            *ngIf="!form.controls.libelleColi.value"
            class="headline m-0 flex-auto">
            Ajouter
          </h2>
      
          <button
            class="text-secondary"
            mat-dialog-close
            mat-icon-button
            type="button">
            <mat-icon svgIcon="mat:close"></mat-icon>
          </button>
      </div>
  
      <mat-divider class="text-border"></mat-divider>
  
      <mat-dialog-content class="flex flex-col">
          <mat-form-field class="flex-auto">
            <mat-label>Libelle</mat-label>
            <input cdkFocusInitial formControlName="libelleColi" matInput />
            <mat-icon matIconPrefix svgIcon="mat:person"></mat-icon>
            <mat-error *ngIf="form.controls.libelleColi.hasError('required')"
              >Veuillez insérer votre libelle.
              </mat-error>
          </mat-form-field>
  
          <mat-form-field class="flex-auto">
            <mat-label>CodeBarre</mat-label>
            <input cdkFocusInitial formControlName="codeBarreColi" matInput />
            <mat-icon matIconPrefix svgIcon="mat:person"></mat-icon>
            <mat-error *ngIf="form.controls.codeBarreColi.hasError('required')"
              >Veuillez insérer votre codeBarre.
              </mat-error>
          </mat-form-field>
  
      </mat-dialog-content>
  
      <mat-dialog-actions align="end">
          <button mat-button mat-dialog-close type="button">Annuler</button>
          <button
            *ngIf="isCreateMode()"
            color="primary"
            mat-flat-button
            type="submit">
            Ajouter
          </button>
          <button
            *ngIf="isUpdateMode()"
            color="primary"
            mat-flat-button
            type="submit">
            Modifier                                                                                       
          </button>
      </mat-dialog-actions>
  
    </form>
    `,
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    NgIf,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule
  ]
})
export class CodeBarreCreateUpdateComponent implements OnInit {

  static id = 0
  form = this.fb.group({
    _id: [this.defaults?._id || ''],
    libelleColi: [this.defaults?.libelleColi || '', Validators.required],
    codeBarreColi: [this.defaults?.codeBarreColi || '', Validators.required],
  });

  mode: 'create' | 'update' = 'create';

  constructor(
    @Inject(MAT_DIALOG_DATA) public defaults: CodeBarreTable | undefined,
    private dialogRef: MatDialogRef<CodeBarreCreateUpdateComponent>,
    private fb: FormBuilder,
  ) { }


  ngOnInit() {
    if (this.defaults) {
      this.mode = 'update';
    } else {
      this.defaults = { _id: CodeBarreCreateUpdateComponent.id++ + '' } as CodeBarreTable;
    }

    this.form.patchValue(this.defaults);
  }

  save() {
    if (!this.form.valid) return
    if (this.mode === 'create') {
      this.create();
    } else if (this.mode === 'update') {
      this.update();
    }
  }

  create() {
    const item = this.form.value as CodeBarreTable;
    this.dialogRef.close(item);
  }

  update() {
    const item: any = this.form.value;
    if (!this.defaults) {
      throw new Error(
        'Item ID does not exist, this customer cannot be updated'
      );
    }
    this.dialogRef.close(item);
  }

  isCreateMode() {
    return this.mode === 'create';
  }

  isUpdateMode() {
    return this.mode === 'update';
  }

}