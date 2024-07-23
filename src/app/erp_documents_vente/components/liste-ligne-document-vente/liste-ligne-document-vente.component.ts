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
import { SharedModule } from 'src/app/utils/shared.module';
import { roundmMontantNumber, roundmMontantString, roundmQuantiteString, roundmTauxNumber, roundmTauxString, showConfirmationDialog } from 'src/app/global-functions';
import { DocumentVente, LigneDocumentVente } from '../../models/document-vente.model';
import { LigneDocumentVenteService } from '../../services/ligne-document-vente.service';
import { ProductServiceService } from 'src/app/erp_params/products/services/product-service.service';
import { ArticleDepotPvs } from 'src/app/erp_params/article-depotpvs/models/articleDepotPvs.model';
import { UtilService } from 'src/app/utils/UtilService.service';
import { InputNumberChangeObservibalService } from 'src/app/utils/directives-input-numbers/services/input-number-change-observibal.service';
import { DataParamRoute } from '../../models/data.model';
import { ActivatedRoute } from '@angular/router';
import { enum_colonnes_list, enum_nomTable } from 'src/app/global-enums';
import { IndexedDbService } from 'src/app/utils/indexedDB_PWA/indexeddb.service';

@Component({
  selector: 'vex-liste-ligne-document-vente',
  templateUrl: './liste-ligne-document-vente.component.html',
  styleUrls: ['./liste-ligne-document-vente.component.scss'],
  standalone: true,
  imports: [
    SharedModule,
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
  ],
})
export class ListeLigneDocumentVenteComponent {
  dataSource!: MatTableDataSource<LigneDocumentVente>;

  layoutCtrl = new UntypedFormControl('fullwidth');

  /**
   * Simulating a service with HTTP that returns Observables
   * You probably want to remove this and do all requests in a service with HTTP
   */
  subject$: ReplaySubject<LigneDocumentVente[]> = new ReplaySubject<LigneDocumentVente[]>(1);
  data$: Observable<LigneDocumentVente[]> = this.subject$.asObservable();
  @Input() lignes:LigneDocumentVente[] = []
  @Input() documentOriginal!:DocumentVente
  @Input() document!:DocumentVente
  @Input() allArticles:ArticleDepotPvs[] = []
  @Input() blockModification:Boolean = false
  
  @Output() newItemEvent = new EventEmitter<[string, Object]>();
  keyOfForm:string = "lignes"
  dataParams:DataParamRoute = new DataParamRoute()

  addChangeEvent() {
    this.newItemEvent.emit([this.keyOfForm, this.lignes]);
  }

  ngOnChanges(changes: SimpleChanges) {
    try{
      setTimeout(()=>{
        this.dataSource.data = this.lignes;
        this.subject$.next(this.lignes);
      })
    }catch(e){}
  }

  @Input() columns: TableColumn<LigneDocumentVente>[] = [
    {
      label: 'N°',
      property: 'numero',
      type: 'text',
      visible: true,
      cssClasses: ['font-medium', 'text']
    },
    {
      label: 'Réference ',
      property: 'reference',
      type: 'image',
      visible: true,
      cssClasses: ['font-medium', 'text']
    },
    {
      label: 'Désignation',
      property: 'designation',
      type: 'image',
      visible: true,
      cssClasses: ['font-medium', 'text']
    },
    {
      label: 'Quantité-livré',
      property: 'quantiteLivre',
      type: 'text',
      visible: false,
      cssClasses: ['font-medium']
    },
    {
      label: 'Quantité-Restante',
      property: 'quantiteRestante',
      type: 'text',
      visible: false,
      cssClasses: ['font-medium']
    },
    {
      label: 'Quantité-1',
      property: 'quantiteUnite1',
      type: 'image',
      visible: true,
      cssClasses: ['font-medium']
    },
    {
      label: 'Unité-1',
      property: 'unite1',
      type: 'image',
      visible: false,
      cssClasses: ['font-medium']
    },
    {
      label: 'Quantité-2',
      property: 'quantiteUnite2',
      type: 'image',
      visible: false,
      cssClasses: ['font-medium']
    },
    {
      label: 'Unité-2',
      property: 'unite2',
      type: 'image',
      visible: false,
      cssClasses: ['font-medium']
    },
    {
      label: 'Dépot',
      property: 'depot',
      type: 'image',
      visible: false,
      cssClasses: ['font-medium']
    },
    {
      label: 'Prix Vente HT',
      property: 'prixVenteBrutHT',
      type: 'image',
      visible: false,
      cssClasses: ['font-medium']
    },
    {
      label: 'total_BrutHT',
      property: 'totalBrutHT',
      type: 'text',
      visible: false,
      cssClasses: ['font-medium']
    },
    {
      label: 'Taux_Remise',
      property: 'tauxremise',
      type: 'image',
      visible: false,
      cssClasses: ['font-medium']
    },
    {
      label: 'Remise Par-Montant',
      property: 'remiseMontant',
      type: 'image',
      visible: false,
      cssClasses: ['font-medium']
    },
    {
      label: 'Total_Remise',
      property: 'totalRemise',
      type: 'text',
      visible: false,
      cssClasses: ['font-medium']
    },
    {
      label: 'Taux_Fodec',
      property: 'tauxFodec',
      type: 'image',
      visible: false,
      cssClasses: ['font-medium']
    },
    {
      label: 'Total_Fodec',
      property: 'totalFodec',
      type: 'text',
      visible: false,
      cssClasses: ['font-medium']
    },
    {
      label: 'Taux_DC',
      property: 'tauxDC',
      type: 'image',
      visible: false,
      cssClasses: ['font-medium']
    },
    {
      label: 'Total_DC',
      property: 'totalDC',
      type: 'text',
      visible: false,
      cssClasses: ['font-medium']
    },
    {
      label: 'Total_HT',
      property: 'totalHT',
      type: 'text',
      visible: false,
      cssClasses: ['font-medium']
    },
    {
      label: 'Total_NetHT',
      property: 'totalNetHT',
      type: 'text',
      visible: true,
      cssClasses: ['font-medium']
    },
    {
      label: 'Taux_TVA (%)',
      property: 'tauxTVA',
      type: 'image',
      visible: true,
      cssClasses: ['font-medium']
    },
    {
      label: 'Total_TVA',
      property: 'totalTVA',
      type: 'text',
      visible: false,
      cssClasses: ['font-medium']
    },
    {
      label: 'Total_TTC',
      property: 'totalTTC',
      type: 'text',
      visible: true,
      cssClasses: ['font-medium']
    },
    {
      label: 'Redevance',
      property: 'redevance',
      type: 'image',
      visible: false,
      cssClasses: ['font-medium']
    },
    {
      label: 'Total_Redevance',
      property: 'totalRedevance',
      type: 'text',
      visible: false,
      cssClasses: ['font-medium']
    },
    {
      label: 'Prix-U-Net-HT',
      property: 'prixVenteUnitaireNetHT',
      type: 'image',
      visible: false,
      cssClasses: ['font-medium']
    },
    {
      label: 'P.U-TTC',
      property: 'prixVenteUnitaireTTC',
      type: 'image',
      visible: true,
      cssClasses: ['font-medium']
    },
  
    { label: 'Actions', property: 'actions', type: 'button', visible: true }

  ];
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  //dataSource!: MatTableDataSource<LigneDocumentVente>;
  selection = new SelectionModel<LigneDocumentVente>(true, []);
  searchCtrl = new UntypedFormControl();

  @ViewChild(MatPaginator, { static: true }) paginator?: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort?: MatSort;

  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  constructor(private dialog: MatDialog, 
    private ligneDocumentVenteService:LigneDocumentVenteService,
    private service:LigneDocumentVenteService,
    public utilService:UtilService,
    private route: ActivatedRoute,
    private indexDB:IndexedDbService ) {
    this.route.data.subscribe((data:any) => {
      this.dataParams = data; // Accessing the 'title' from the route data
    });
  }

  get visibleColumns() {
    return this.columns
      .filter((column) => column.visible)
      .map((column) => column.property);
  }

  static _id=1

  async ngOnInit() {
    
    this.dataSource = new MatTableDataSource();

    this.data$.pipe(filter<LigneDocumentVente[]>(Boolean)).subscribe((lignes) => {
      this.lignes = lignes;
      this.dataSource.data = lignes;
    });

    this.searchCtrl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.onFilterChange(value));
    
  }

  async ngAfterViewInit() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }

    if (this.sort) {
      this.dataSource.sort = this.sort;
    }

    let colonnes:TableColumn<LigneDocumentVente>[] = await this.indexDB.getIndexedDB(enum_colonnes_list.ligneDocumentVENTE) as TableColumn<LigneDocumentVente>[]
    if(colonnes) this.columns = colonnes
  }

  getTextTauxTVA(taux:number){
    return roundmTauxString(taux)
  }

  getTextMontants(mt:number){
    return  roundmMontantString(mt)
  }

  getTextQuantites(qte:number){
    return roundmQuantiteString(qte)
  }

  createEmplacementTable() {
  }

  updateEmplacementTable(product: LigneDocumentVente) {

  }

  deleteProduct(item: LigneDocumentVente) {
    showConfirmationDialog('Suppression', 'Êtes-vous sûr de vouloir supprimer le ligne numero "'+item.numero+'" ?')
    .then((result) => {
      if (result.isConfirmed) {
        this.lignes.splice(
          this.lignes.findIndex(
            (existingItem) => existingItem._id === item._id
          ),
          1
        );
        this.selection.deselect(item);
        this.subject$.next(this.lignes);
        this.addChangeEvent()
      } else {
        // User cancelled, handle accordingly
      }
    });
  }

  changeMontantHT(item:LigneDocumentVente){
  /*  let montantTVAVente = roundmMontantNumber(item.montantHT * item.tauxTVA / 100)
    item.montantTTC = roundmMontantNumber(roundmMontantNumber(montantTVAVente) + roundmMontantNumber(item.montantHT))
  */
  }

  changeMontantTTC(item:LigneDocumentVente){
  /*  item.montantHT = roundmMontantNumber(roundmMontantNumber(item.montantTTC) * 100 / (Number(item.tauxTVA) + 100))
    this.changeMontantHT(item)
    */
  }

  deleteProducts(lignes: LigneDocumentVente[]) {
    lignes.forEach((c) => this.deleteProduct(c));
  }

  onFilterChange(value: string) {
    if (!this.dataSource) {
      return;
    }
    value = value.trim();
    value = value.toLowerCase();
    this.dataSource.filter = value;
  }

  toggleColumnVisibility(column: TableColumn<LigneDocumentVente>, event: Event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    column.visible = !column.visible;
  }

  async saveColumnVisibility() {
    await this.indexDB.putIndexedDB(enum_colonnes_list.ligneDocumentVENTE, this.columns, 0)
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

  changeQuantite1(item: LigneDocumentVente){
    item = this.ligneDocumentVenteService.changeQuantite1(item)
    this.changeTotals(item)
    this.checkQuantite(item)
  }

  changeQuantite2(item: LigneDocumentVente){
    item = this.ligneDocumentVenteService.changeQuantite2(item)
    this.changeTotals(item)
    this.checkQuantite(item)
  }

  checkQuantite(item:LigneDocumentVente){
    if(this.dataParams.withCheckQuantiteRestante === true && this.document.documentPrecedent && this.document.documentPrecedent.length > 0 && (this.document.documentPrecedent[0].table == enum_nomTable.K_bonCommandeClients || this.document.documentPrecedent[0].table == enum_nomTable.K_bonLivraisons)){
      this.checkQuantiteRestante(item)
    }
    if(this.dataParams.withCheckQuantiteStock === true)
      return this.ligneDocumentVenteService.checkQuantiteIsValide(this.documentOriginal, this.lignes, this.allArticles, undefined, item)
    else return true 
  }

  checkQuantiteRestante(item:LigneDocumentVente){
    return this.ligneDocumentVenteService.checkQuantiteRestanteIsValid(this.documentOriginal, this.document, this.lignes, this.allArticles, undefined, item)
  }

  changePrixVHT(item: LigneDocumentVente){
    item = this.service.changePrixVente(item)
  }

  changeTotals(item: LigneDocumentVente){
    if(item.isQte1 == true){
      item = this.ligneDocumentVenteService.changeTotals(item)
    }else{
      item = this.ligneDocumentVenteService.changeTotals(item, true)
    }
    InputNumberChangeObservibalService.submitChangeInput()
  }

  changePrixUnitaireHT(item: LigneDocumentVente){
    item = this.ligneDocumentVenteService.changePrixUnitaireHT(item)
    this.changePrixVHT(item)
    this.changeTotals(item)
  }

  changePrixUnitaireTTC(item: LigneDocumentVente){
    item = this.ligneDocumentVenteService.changePrixUnitaireTTC(item)
    this.changePrixUnitaireHT(item)
  }

}

