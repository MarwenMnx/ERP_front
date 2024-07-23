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
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormControl,
  Validators
} from '@angular/forms';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
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
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { EventEmitter } from 'stream';
import {AppDateAdapter, APP_DATE_FORMATS} from '../../../utils/dateAdapter/date.adapter';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS,MAT_DATE_LOCALE, MatOptionModule } from "@angular/material/core";
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { SharedModule } from 'src/app/utils/shared.module';
import { dateVaidator, getDateByForma, getDateInput, isObjectIdMongoose, notEqualToZero, roundmMontantString, showAlertError, showAlertSucess, showLoading, succesAlerteAvecTimer } from 'src/app/global-functions';
import { TokenService } from 'src/app/services/token.service';
import { Lettrage, Reglement } from 'src/app/erp_params/reglements/models/reglement.model';
import { ReglementHttpService } from 'src/app/erp_params/reglements/services/reglement-http.service';
import { BanqueHttpService } from 'src/app/erp_params/banque/services/banque-http.service';
import { StandartAutocompleteComponent } from 'src/app/utils/autocompletes/standart-autocomplete/standart-autocomplete.component';
import { Banque, IBanqueCollection } from 'src/app/erp_params/banque/models/banque.model';
import { CompteBancaires, ICompteBancaires } from 'src/app/erp_params/compteBancaires/models/compteBancaires.model';
import { DocumentVenteCreateUpdateComponent } from '../../document-vente-create-update/document-vente-create-update.component';
import { ListeLigneDocumentVenteComponent } from '../liste-ligne-document-vente/liste-ligne-document-vente.component';


@Component({
  selector: 'vex-modal-doc-lignes',
  templateUrl: './modal-doc-lignes.component.html',
  styleUrls: ['./modal-doc-lignes.component.scss'],
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
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    SharedModule,
    StandartAutocompleteComponent,
    ListeLigneDocumentVenteComponent,
  ],
  providers:
  [
     { provide: AppDateAdapter ,  useClass: AppDateAdapter }, // Parse MatDatePicker Format
   // { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
    //{ provide: MAT_DATE_LOCALE, useValue: 'fr' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ]
})
export class ModalDocLignesComponent {
  selectCtrl: UntypedFormControl = new UntypedFormControl();
 
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any | undefined,
    private banqueServiceHttp:BanqueHttpService,
    private reglementHTTPService:ReglementHttpService,
    private dialogRef: MatDialogRef<DocumentVenteCreateUpdateComponent>,
    private fb: FormBuilder,
    private tokenService:TokenService
  ) {
    console.log(data);
    
  }

  ngOnInit() {}

  accepteDownloadLignes(){
    this.dialogRef.close(this.data.document);
  }

}
