import {
  AfterViewInit,
  Component,
  DestroyRef,
  inject,
  Input, OnChanges, SimpleChanges,
  OnInit,
  ViewChild
} from '@angular/core';
import { Observable, of, ReplaySubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TableColumn } from '@vex/interfaces/table-column.interface';
import {
  aioTableData,
  aioTableLabels
} from '../../../../static-data/aio-table-data';
import { SelectionModel } from '@angular/cdk/collections';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { stagger40ms } from '@vex/animations/stagger.animation';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormControl
} from '@angular/forms';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { AsyncPipe, CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { VexPageLayoutContentDirective } from '@vex/components/vex-page-layout/vex-page-layout-content.directive';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { VexBreadcrumbsComponent } from '@vex/components/vex-breadcrumbs/vex-breadcrumbs.component';
import { VexPageLayoutHeaderDirective } from '@vex/components/vex-page-layout/vex-page-layout-header.directive';
import { VexPageLayoutComponent } from '@vex/components/vex-page-layout/vex-page-layout.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatInputModule } from '@angular/material/input';

import { MatFormFieldModule } from '@angular/material/form-field';
import { VexHighlightDirective } from '@vex/components/vex-highlight/vex-highlight.directive';

import { MatTabsModule } from '@angular/material/tabs';
import { MatRadioModule } from '@angular/material/radio';
import { MatDividerModule } from '@angular/material/divider';
import { MatOptionModule } from '@angular/material/core';
import { VexSecondaryToolbarComponent } from '@vex/components/vex-secondary-toolbar/vex-secondary-toolbar.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Output, EventEmitter } from '@angular/core';
import { ReglementsCreateUpdateComponent } from './reglements-create-update.component';

import { Router } from '@angular/router';
import { FideliteComponent } from 'src/app/erp_params/products/fidelite/fidelite.component';
import { DocumentsComponent } from 'src/app/erp_params/products/documents/documents.component';

import { DocumentAchat } from '../../models/document-achat.model';
import { getDateByForma, isObjectIdMongoose, roundmMontantString, showAlertError, showConfirmationDialog, succesAlerteAvecTimer } from 'src/app/global-functions';
import { Lettrage, Reglement } from 'src/app/erp_params/reglements/models/reglement.model';
import { ReglementHttpService } from 'src/app/erp_params/reglements/services/reglement-http.service';
import { DocumentVente } from 'src/app/erp_documents_vente/models/document-vente.model';
import { UtilService } from 'src/app/utils/UtilService.service';
import {enum_type_document} from "../../../global-enums";

@Component({
  selector: 'vex-reglements',
  templateUrl: './reglements.component.html',
  styleUrls: ['./reglements.component.scss'],
  animations: [fadeInUp400ms, stagger40ms],
  standalone: true,
  imports: [
    VexSecondaryToolbarComponent,
    VexBreadcrumbsComponent,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    NgIf,
    ReactiveFormsModule,
    NgFor,
    MatDatepickerModule,
    MatSliderModule,
    MatRadioModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    AsyncPipe,
    VexSecondaryToolbarComponent,
    VexBreadcrumbsComponent,
    MatSelectModule,
    MatOptionModule,
    ReactiveFormsModule,
    MatDialogModule,
    NgIf,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatDividerModule,
    MatInputModule,
    MatCheckboxModule,
    MatRadioModule,
    MatTabsModule,
    CommonModule,
    FideliteComponent,
    DocumentsComponent,
    MatInputModule,
    ReactiveFormsModule,
    NgIf,
    MatButtonModule,
    MatIconModule,
    VexHighlightDirective,
    AsyncPipe,
    VexPageLayoutComponent,
    VexPageLayoutHeaderDirective,
    VexBreadcrumbsComponent,
    MatButtonToggleModule,
    ReactiveFormsModule,
    VexPageLayoutContentDirective,
    NgIf,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    MatMenuModule,
    MatTableModule,
    MatSortModule,
    MatCheckboxModule,
    NgFor,
    NgClass,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    FormsModule,
    MatDialogModule,
    MatInputModule,
    DocumentsComponent
  ],
})
export class ReglementsComponent {

  layoutCtrl = new UntypedFormControl('boxed');

  @Input() tab_reg = enum_type_document.REGLEMENT_FOURNISSEUR+"" ; //"reglementfournisseurs"
  @Input() type_doc = enum_type_document.BON_RECEPTION_FOURNISSEUR+""  ;//"bonreception_frs"

  @Input() document:DocumentAchat | DocumentVente = new DocumentAchat()
  @Input() listItems: Reglement[] = [];
  @Input() isDocumentAchat:boolean = true;

  @Output() misaJourParent = new EventEmitter<[string, Object]>();
  keyOfForm:string = "reglements"
  addChangeEvent() {
    this.misaJourParent.emit([this.keyOfForm, this.listItems]);
  }

  ngOnChanges(changes: SimpleChanges) {
    try{
      this.subject$.next(this.listItems);
    }catch(e){}
  }

  isMongoId(_id:string){
     return isObjectIdMongoose(_id)
  }

  /**
   * Simulating a service with HTTP that returns Observables
   * You probably want to remove this and do all requests in a service with HTTP
   */
  subject$: ReplaySubject<Reglement[]> = new ReplaySubject<Reglement[]>(1);
  data$: Observable<Reglement[]> = this.subject$.asObservable();

  @Input()
  columns: TableColumn<Reglement>[] = [
    {
      label: 'Numéro',
      property: 'numero',
      type: 'text',
      visible: true,
      cssClasses: ['font-medium']
    },
    {
      label: 'Numéro Doc',
      property: 'numeroDoc',
      type: 'image',
      visible: true,
      cssClasses: ['font-medium']
    },
    {
      label: 'Date',
      property: 'date',
      type: 'image',
      visible: true,
      cssClasses: ['font-medium']
    },
    {
      label: 'Montant',
      property: 'montant',
      type: 'image',
      visible: true,
      cssClasses: ['font-medium']
    },
    {
      label: 'modeReglement',
      property: 'modeReglement',
      type: 'image',
      visible: true,
      cssClasses: ['font-medium']
    },
    {
      label: 'Numero Piece',
      property: 'numPiece',
      type: 'text',
      visible: true,
      cssClasses: ['font-medium']
    },
    {
      label: 'DateEcheance',
      property: 'dateEcheance',
      type: 'image',
      visible: true,
      cssClasses: ['font-medium']
    },
    {
      label: 'titulaire',
      property: 'titulaire',
      type: 'text',
      visible: true,
      cssClasses: ['font-medium']
    },
    {
      label: 'Banque',
      property: 'banque',
      type: 'image',
      visible: true,
      cssClasses: ['font-medium']
    },
    {
      label: 'CompteBancaire',
      property: 'compteBancaire',
      type: 'image',
      visible: true,
      cssClasses: ['font-medium']
    },
    {
      label: 'notes',
      property: 'note',
      type: 'text',
      visible: true,
      cssClasses: ['font-medium']
    },

    { label: 'Actions', property: 'actions', type: 'button', visible: true }
  ];

  getDateFormat(date:Date){
    return getDateByForma(date)
  }

  getMontant(nbr:number){
    return roundmMontantString(nbr)
  }

  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  dataSource!: MatTableDataSource<Reglement>;
  selection = new SelectionModel<Reglement>(true, []);
  searchCtrl = new UntypedFormControl();

  @ViewChild(MatPaginator, { static: true }) paginator?: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort?: MatSort;

  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  constructor(private dialog: MatDialog, private router:Router,
    private reglementHTTPService:ReglementHttpService,
    public utilService:UtilService) {
    }

  get visibleColumns() {
    return this.columns
      .filter((column) => column.visible)
      .map((column) => column.property);
  }

  ngOnInit() {

    /*this.serviceHttp.GetAll().subscribe((res) => {
      this.subject$.next(this.serviceHttp.getData(res.RESULTAT));
    });*/

    this.dataSource = new MatTableDataSource();

    this.data$.pipe(filter<Reglement[]>(Boolean)).subscribe((listItems) => {
      this.listItems = listItems;
      this.dataSource.data = listItems;
    });

    this.searchCtrl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.onFilterChange(value));
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }

    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  create() {
    if(this.document.documentSuivant && this.document.documentSuivant.length && this.document.documentSuivant.length > 0){
      showAlertError('Erreur!', this.message);
      return
    }

    this.dialog
    .open(ReglementsCreateUpdateComponent, {
      data: {
        document: this.document,
        tab_reg: this.tab_reg,
        type_doc: this.type_doc,
        isDocumentAchat:this.isDocumentAchat
      },
    })
    .afterClosed()
    .subscribe((item: Reglement) => {
      if (item) {
        if(!this.listItems) this.listItems = []
        this.listItems.unshift(new Reglement(item));
        this.subject$.next(this.listItems);
        this.addChangeEvent()
      }
    });
  }

  message:string = "On ne peut pas continuer car il est bloqué."

  update(item: Reglement) {
    if(this.document.documentSuivant && this.document.documentSuivant.length && this.document.documentSuivant.length > 0){
      showAlertError('Erreur!', this.message);
      return
    }

    if(item.lettrageReglement && item.lettrageReglement instanceof Array && item.lettrageReglement.length > 0 && item.lettrageReglement[0].document1 && document && item.lettrageReglement[0].document1._id !== this.document._id){
      showAlertError('Erreur!', this.message);
      return
    }

    if(!this.isMongoId(this.document._id) && this.isMongoId(item._id ? item._id : "")) return
    
    this.dialog
    .open(ReglementsCreateUpdateComponent, {
      data: {
        reglement: item,
        document: this.document,
        tab_reg: this.tab_reg,
        type_doc: this.type_doc,
        isDocumentAchat:this.isDocumentAchat
      },
    })
    .afterClosed()
    .subscribe((updatedItem) => {
      if (updatedItem) {
        const index = this.listItems.findIndex(
          (existingItem) => existingItem._id === updatedItem._id
        );
        this.listItems[index] = new Reglement(updatedItem);
        this.subject$.next(this.listItems);
        this.addChangeEvent()
      }
    });
  }

  delete(item: Reglement) {
    if(this.document.documentSuivant && this.document.documentSuivant.length && this.document.documentSuivant.length > 0){
      showAlertError('Erreur!', this.message);
      return
    }

    if(item.lettrageReglement && item.lettrageReglement.documents instanceof Array && item.lettrageReglement.documents.length > 0 && item.lettrageReglement.documents[0]._id !== this.document._id){
      showAlertError('Erreur!', this.message);
      return
    }

    if(!this.isMongoId(this.document._id) && this.isMongoId(item._id ? item._id : "")) return
    showConfirmationDialog('Suppression', 'Êtes-vous sûr de vouloir supprimer règlement " '+item.numero+' " ?')
    .then((result) => {
      if (result.isConfirmed) {
        if(!isObjectIdMongoose(this.document?._id)){
          this.deleteItem(item)
        }else{
          let item1:any = item
          item1.tab_reg = this.tab_reg
          this.reglementHTTPService.delete(item).subscribe((res) => {
            if(res.OK === true){
              this.deleteItem(item)
            }else{
              showAlertError(res.MESSAGE, res.RESULTAT)
            }
          });
        }
      } else {
        // User cancelled, handle accordingly
      }
    });
  }

  deleteItem(item:Reglement){
    this.listItems.splice(
      this.listItems.findIndex(
        (existingItem) => existingItem._id === item._id
      ),
      1
    );
    this.selection.deselect(item);
    this.subject$.next(this.listItems);
    this.addChangeEvent()
  }

  deleteItems(listItems: Reglement[]) {
    /**
     * Here we are updating our local array.
     * You would probably make an HTTP request here.
     */
    listItems.forEach((c) => this.delete(c));
  }

  onFilterChange(value: string) {
    if (!this.dataSource) {
      return;
    }
    value = value.trim();
    value = value.toLowerCase();
    this.dataSource.filter = value;
  }

  toggleColumnVisibility(column: TableColumn<Reglement>, event: Event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    column.visible = !column.visible;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  trackByProperty<T>(index: number, column: TableColumn<T>) {
    return column.property;
  }

  /*onLabelChange(change: MatSelectChange, row: Reglement) {
    const index = this.listItems.findIndex((c) => c === row);
    this.listItems[index].labels = change.value;
    this.subject$.next(this.products);
  }*/

}
