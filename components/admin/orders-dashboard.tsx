"use client";

import {
  type ColumnDef,
  type ColumnFiltersState,
  type FilterFn,
  flexRender,
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type Row,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  ChevronDown,
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  CircleX,
  Clipboard,
  Columns3,
  Download,
  Ellipsis,
  Eye,
  Filter,
  PackageCheck,
  Search,
  ShoppingBag,
  Trash2,
  Truck,
  Wallet,
  X,
} from "lucide-react";
import { useId, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";

export type OrderStatus = "Pendiente" | "Preparando" | "Enviado" | "Entregado" | "Cancelado";

export type AdminOrder = {
  id: string;
  orderNumber: string;
  name: string;
  email: string;
  location: string;
  flag: string;
  status: OrderStatus;
  balance: number;
  createdAt: string;
  paymentMethod: string;
  deliveryType: string;
  address: string;
  items: Array<{ name: string; quantity: number; unitPrice: number }>;
};

const DEMO_ORDERS: AdminOrder[] = [
  { id: "ord-1048", orderNumber: "WU-1048", name: "Lucía Fernández", email: "lucia.fernandez@email.com", location: "Buenos Aires", flag: "🇦🇷", status: "Preparando", balance: 26800, createdAt: "2026-09-26T10:14:00", paymentMethod: "Tarjeta", deliveryType: "Envío a domicilio", address: "Palermo, Buenos Aires", items: [{ name: "Bocaditos de pollo", quantity: 2, unitPrice: 8900 }, { name: "Mix crujiente", quantity: 1, unitPrice: 7500 }, { name: "Galletas caseras", quantity: 1, unitPrice: 6900 }] },
  { id: "ord-1047", orderNumber: "WU-1047", name: "Mateo González", email: "mateo.gonzalez@email.com", location: "Córdoba", flag: "🇦🇷", status: "Enviado", balance: 19800, createdAt: "2026-09-26T09:32:00", paymentMethod: "Transferencia", deliveryType: "Envío a domicilio", address: "Nueva Córdoba, Córdoba", items: [{ name: "Premios de salmón", quantity: 2, unitPrice: 9900 }] },
  { id: "ord-1046", orderNumber: "WU-1046", name: "Valentina López", email: "vale.lopez@email.com", location: "Rosario", flag: "🇦🇷", status: "Pendiente", balance: 16400, createdAt: "2026-09-26T08:51:00", paymentMethod: "Pendiente", deliveryType: "Retiro en tienda", address: "Centro, Rosario", items: [{ name: "Bocaditos de pollo", quantity: 1, unitPrice: 8900 }, { name: "Galletas caseras", quantity: 1, unitPrice: 7500 }] },
  { id: "ord-1045", orderNumber: "WU-1045", name: "Tomás Romero", email: "tomas.romero@email.com", location: "Mendoza", flag: "🇦🇷", status: "Entregado", balance: 27300, createdAt: "2026-09-25T18:21:00", paymentMethod: "Tarjeta", deliveryType: "Envío a domicilio", address: "Godoy Cruz, Mendoza", items: [{ name: "Mix crujiente", quantity: 2, unitPrice: 7500 }, { name: "Premios de salmón", quantity: 1, unitPrice: 9900 }, { name: "Galletas caseras", quantity: 1, unitPrice: 2400 }] },
  { id: "ord-1044", orderNumber: "WU-1044", name: "Sofía Torres", email: "sofia.torres@email.com", location: "Buenos Aires", flag: "🇦🇷", status: "Preparando", balance: 35600, createdAt: "2026-09-25T16:02:00", paymentMethod: "Tarjeta", deliveryType: "Envío a domicilio", address: "Belgrano, Buenos Aires", items: [{ name: "Bocaditos de pollo", quantity: 4, unitPrice: 8900 }] },
  { id: "ord-1043", orderNumber: "WU-1043", name: "Joaquín Díaz", email: "joaquin.diaz@email.com", location: "La Plata", flag: "🇦🇷", status: "Cancelado", balance: 7500, createdAt: "2026-09-25T13:44:00", paymentMethod: "Reembolsado", deliveryType: "Retiro en tienda", address: "La Plata, Buenos Aires", items: [{ name: "Mix crujiente", quantity: 1, unitPrice: 7500 }] },
  { id: "ord-1042", orderNumber: "WU-1042", name: "Camila Suárez", email: "camila.suarez@email.com", location: "Mar del Plata", flag: "🇦🇷", status: "Entregado", balance: 28700, createdAt: "2026-09-24T11:06:00", paymentMethod: "Transferencia", deliveryType: "Envío a domicilio", address: "La Perla, Mar del Plata", items: [{ name: "Premios de salmón", quantity: 1, unitPrice: 9900 }, { name: "Bocaditos de pollo", quantity: 1, unitPrice: 8900 }, { name: "Mix crujiente", quantity: 1, unitPrice: 9900 }] },
  { id: "ord-1041", orderNumber: "WU-1041", name: "Benjamín Castro", email: "benja.castro@email.com", location: "Buenos Aires", flag: "🇦🇷", status: "Enviado", balance: 13800, createdAt: "2026-09-24T09:19:00", paymentMethod: "Tarjeta", deliveryType: "Retiro en tienda", address: "Caballito, Buenos Aires", items: [{ name: "Galletas caseras", quantity: 2, unitPrice: 6900 }] },
  { id: "ord-1040", orderNumber: "WU-1040", name: "Martina Acosta", email: "martina.acosta@email.com", location: "Tigre", flag: "🇦🇷", status: "Pendiente", balance: 17800, createdAt: "2026-09-23T17:08:00", paymentMethod: "Pendiente", deliveryType: "Envío a domicilio", address: "Tigre, Buenos Aires", items: [{ name: "Bocaditos de pollo", quantity: 2, unitPrice: 8900 }] },
  { id: "ord-1039", orderNumber: "WU-1039", name: "Franco Herrera", email: "franco.herrera@email.com", location: "Santa Fe", flag: "🇦🇷", status: "Entregado", balance: 17400, createdAt: "2026-09-23T12:34:00", paymentMethod: "Tarjeta", deliveryType: "Envío a domicilio", address: "Santa Fe Capital", items: [{ name: "Mix crujiente", quantity: 1, unitPrice: 7500 }, { name: "Galletas caseras", quantity: 1, unitPrice: 9900 }] },
  { id: "ord-1038", orderNumber: "WU-1038", name: "Milagros Silva", email: "mili.silva@email.com", location: "Córdoba", flag: "🇦🇷", status: "Entregado", balance: 29700, createdAt: "2026-09-22T15:12:00", paymentMethod: "Transferencia", deliveryType: "Envío a domicilio", address: "Villa Allende, Córdoba", items: [{ name: "Premios de salmón", quantity: 3, unitPrice: 9900 }] },
  { id: "ord-1037", orderNumber: "WU-1037", name: "Renata Molina", email: "renata.molina@email.com", location: "San Isidro", flag: "🇦🇷", status: "Preparando", balance: 16400, createdAt: "2026-09-22T10:43:00", paymentMethod: "Tarjeta", deliveryType: "Retiro en tienda", address: "San Isidro, Buenos Aires", items: [{ name: "Bocaditos de pollo", quantity: 1, unitPrice: 8900 }, { name: "Galletas caseras", quantity: 1, unitPrice: 7500 }] },
];

const statuses: OrderStatus[] = ["Pendiente", "Preparando", "Enviado", "Entregado", "Cancelado"];
const currency = (value: number) => new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(value);
const dateTime = (value: string) => new Intl.DateTimeFormat("es-AR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));

const statusStyles: Record<OrderStatus, string> = {
  Pendiente: "border-amber-200 bg-amber-50 text-amber-800",
  Preparando: "border-blue-200 bg-blue-50 text-blue-800",
  Enviado: "border-violet-200 bg-violet-50 text-violet-800",
  Entregado: "border-emerald-200 bg-emerald-50 text-emerald-800",
  Cancelado: "border-red-200 bg-red-50 text-red-800",
};

const customerSearchFilter: FilterFn<AdminOrder> = (row, _columnId, filterValue: string) => {
  const query = (filterValue ?? "").trim().toLocaleLowerCase("es");
  const searchable = `${row.original.orderNumber} ${row.original.name} ${row.original.email}`.toLocaleLowerCase("es");
  return searchable.includes(query);
};

const statusFilter: FilterFn<AdminOrder> = (row, columnId, filterValue: OrderStatus[]) => {
  if (!filterValue?.length) return true;
  return filterValue.includes(row.getValue(columnId) as OrderStatus);
};

type OrdersTableProps = {
  data?: AdminOrder[];
  onDataChange?: (orders: AdminOrder[]) => void;
};

export function OrdersTable({ data: sourceOrders = DEMO_ORDERS, onDataChange }: OrdersTableProps) {
  const inputId = useId();
  const filterRef = useRef<HTMLInputElement>(null);
  const showFeedback = useStore((state) => state.showFeedback);
  const [data, setData] = useState(sourceOrders);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = useState<SortingState>([{ id: "createdAt", desc: true }]);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [pendingDelete, setPendingDelete] = useState<AdminOrder[] | null>(null);
  const [menuOrder, setMenuOrder] = useState<string | null>(null);

  const columns = useMemo<ColumnDef<AdminOrder>[]>(() => [
    {
      id: "select",
      header: ({ table }) => <input type="checkbox" aria-label="Seleccionar todos los pedidos de esta página" checked={table.getIsAllPageRowsSelected()} ref={(element) => { if (element) element.indeterminate = table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected(); }} onChange={(event) => table.toggleAllPageRowsSelected(event.target.checked)} className="size-4 accent-[#167a63]" />,
      cell: ({ row }) => <input type="checkbox" aria-label={`Seleccionar pedido ${row.original.orderNumber}`} checked={row.getIsSelected()} onChange={(event) => row.toggleSelected(event.target.checked)} className="size-4 accent-[#167a63]" />,
      size: 36,
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "name",
      accessorKey: "name",
      header: "Pedido / cliente",
      cell: ({ row }) => <div className="min-w-48"><p className="font-semibold text-[#17221c]">{row.original.name}</p><p className="mt-1 text-xs text-[#17221c]/55">{row.original.orderNumber}</p></div>,
      size: 220,
      filterFn: customerSearchFilter,
      enableHiding: false,
    },
    { accessorKey: "email", header: "Email", cell: ({ row }) => <span className="text-sm text-[#17221c]/70">{row.original.email}</span>, size: 230 },
    { accessorKey: "location", header: "Ubicación", cell: ({ row }) => <span className="whitespace-nowrap"><span className="mr-2" aria-hidden="true">{row.original.flag}</span>{row.original.location}</span>, size: 170 },
    {
      accessorKey: "status",
      header: "Estado",
      cell: ({ row }) => <span className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyles[row.original.status]}`}>{row.original.status}</span>,
      size: 135,
      filterFn: statusFilter,
    },
    {
      accessorKey: "balance",
      header: "Total pedido",
      cell: ({ row }) => <span className="whitespace-nowrap font-semibold">{currency(row.original.balance)}</span>,
      size: 145,
    },
    {
      accessorKey: "createdAt",
      header: "Fecha",
      cell: ({ row }) => <span className="whitespace-nowrap text-sm text-[#17221c]/60">{dateTime(row.original.createdAt)}</span>,
      size: 180,
    },
    {
      id: "actions",
      header: () => <span className="sr-only">Acciones</span>,
      cell: ({ row }) => <OrderActions row={row} onView={setSelectedOrder} onMenu={setMenuOrder} menuOpen={menuOrder === row.original.id} onCopy={() => { void navigator.clipboard?.writeText(row.original.orderNumber); showFeedback({ type: "success", title: "Número copiado", description: row.original.orderNumber }); setMenuOrder(null); }} onDelete={() => { setPendingDelete([row.original]); setMenuOrder(null); }} />,
      size: 56,
      enableHiding: false,
      enableSorting: false,
    },
  ], [menuOrder, showFeedback]);

  const table = useReactTable({
    data,
    columns,
    getRowId: (row) => row.id,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    enableSortingRemoval: false,
    state: { sorting, columnFilters, columnVisibility, pagination },
  });

  const searchValue = columnFilters.find((filter) => filter.id === "name")?.value as string | undefined;
  const uniqueStatuses = useMemo(() => [...new Set(data.map((order) => order.status))].sort() as OrderStatus[], [data]);
  const statusCounts = useMemo(() => {
    const search = (searchValue ?? "").toLocaleLowerCase("es");
    const counts = new Map<OrderStatus, number>();
    for (const order of data) {
      const searchable = `${order.orderNumber} ${order.name} ${order.email}`.toLocaleLowerCase("es");
      if (searchable.includes(search)) counts.set(order.status, (counts.get(order.status) ?? 0) + 1);
    }
    return counts;
  }, [data, searchValue]);
  const selectedStatuses = useMemo(() => (columnFilters.find((filter) => filter.id === "status")?.value as OrderStatus[] | undefined) ?? [], [columnFilters]);
  const selectedRows = table.getSelectedRowModel().rows;

  const updateStatusFilter = (status: OrderStatus, checked: boolean) => {
    const next = checked ? [...selectedStatuses, status] : selectedStatuses.filter((item) => item !== status);
    table.getColumn("status")?.setFilterValue(next.length ? next : undefined);
    table.setPageIndex(0);
  };

  const removePending = () => {
    if (!pendingDelete) return;
    const ids = new Set(pendingDelete.map((order) => order.id));
    const updatedOrders = data.filter((order) => !ids.has(order.id));
    setData(updatedOrders);
    onDataChange?.(updatedOrders);
    table.resetRowSelection();
    showFeedback({ type: "success", title: "Pedidos quitados de la vista", description: `${ids.size} pedido(s) removido(s) del conjunto de demostración.` });
    setPendingDelete(null);
  };

  const exportCsv = () => {
    const rows = table.getFilteredRowModel().rows.map((row) => row.original);
    const csv = [
      ["Pedido", "Cliente", "Email", "Ubicación", "Estado", "Total", "Fecha"],
      ...rows.map((order) => [order.orderNumber, order.name, order.email, order.location, order.status, order.balance.toString(), order.createdAt]),
    ].map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "wuff-pedidos-demo.csv";
    anchor.click();
    URL.revokeObjectURL(url);
    showFeedback({ type: "success", title: "Exportación lista", description: `${rows.length} pedidos exportados a CSV.` });
  };

  return (
    <section className="space-y-5" aria-label="Tabla de pedidos">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div><h2 className="text-lg font-semibold text-[#17221c]">Pedidos</h2><p className="mt-1 text-sm text-[#17221c]/55">Revisá pedidos, clientes y estados de entrega.</p></div>
        <Button variant="outline" onPress={exportCsv} className="gap-2"><Download className="size-4" />Exportar pedidos</Button>
      </div>

      <div className="flex flex-col justify-between gap-3 xl:flex-row xl:items-center">
        <div className="flex flex-wrap items-center gap-2">
          <label className="relative block" htmlFor={`${inputId}-search`}>
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#17221c]/45" />
            <input id={`${inputId}-search`} ref={filterRef} value={(table.getColumn("name")?.getFilterValue() as string) ?? ""} onChange={(event) => { table.getColumn("name")?.setFilterValue(event.target.value); table.setPageIndex(0); }} placeholder="Buscar pedido, cliente o email" className="h-10 w-[min(78vw,22rem)] rounded-md border border-[#17221c]/15 bg-white pl-9 pr-9 text-sm outline-none focus:border-[#167a63] focus:ring-2 focus:ring-[#167a63]/15" />
            {Boolean(table.getColumn("name")?.getFilterValue()) && <button type="button" aria-label="Limpiar búsqueda" onClick={() => { table.getColumn("name")?.setFilterValue(""); filterRef.current?.focus(); }} className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-[#17221c]/50 hover:bg-[#17221c]/5"><CircleX className="size-4" /></button>}
          </label>

          <details className="relative">
            <summary className="flex h-10 cursor-pointer list-none items-center gap-2 rounded-md border border-[#17221c]/15 bg-white px-3 text-sm font-medium hover:bg-[#17221c]/[0.03]"><Filter className="size-4" />Estado{selectedStatuses.length > 0 && <span className="rounded bg-[#167a63]/10 px-1.5 py-0.5 text-xs text-[#167a63]">{selectedStatuses.length}</span>}</summary>
            <div className="absolute left-0 top-12 z-30 w-56 rounded-md border border-[#17221c]/10 bg-white p-3 shadow-lg">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#17221c]/50">Filtrar estado</p>
              {uniqueStatuses.map((status) => <label key={status} className="flex cursor-pointer items-center justify-between gap-3 rounded px-2 py-2 text-sm hover:bg-[#17221c]/[0.04]"><span className="flex items-center gap-2"><input type="checkbox" checked={selectedStatuses.includes(status)} onChange={(event) => updateStatusFilter(status, event.target.checked)} className="size-4 accent-[#167a63]" />{status}</span><span className="text-xs text-[#17221c]/45">{statusCounts.get(status) ?? 0}</span></label>)}
            </div>
          </details>

          <details className="relative">
            <summary className="flex h-10 cursor-pointer list-none items-center gap-2 rounded-md border border-[#17221c]/15 bg-white px-3 text-sm font-medium hover:bg-[#17221c]/[0.03]"><Columns3 className="size-4" />Columnas</summary>
            <div className="absolute left-0 top-12 z-30 w-48 rounded-md border border-[#17221c]/10 bg-white p-2 shadow-lg">
              {table.getAllLeafColumns().filter((column) => column.getCanHide()).map((column) => <label key={column.id} className="flex cursor-pointer items-center gap-2 rounded px-2 py-2 text-sm capitalize hover:bg-[#17221c]/[0.04]"><input type="checkbox" checked={column.getIsVisible()} onChange={column.getToggleVisibilityHandler()} className="size-4 accent-[#167a63]" />{column.id === "balance" ? "Total pedido" : column.id === "createdAt" ? "Fecha" : column.id === "email" ? "Email" : "Ubicación"}</label>)}
            </div>
          </details>
        </div>

        {selectedRows.length > 0 && <Button variant="outline" onPress={() => setPendingDelete(selectedRows.map((row) => row.original))} className="gap-2 self-start border-red-200 text-red-700 hover:bg-red-50"><Trash2 className="size-4" />Eliminar<span className="rounded border border-red-200 px-1.5 text-xs">{selectedRows.length}</span></Button>}
      </div>

      <div className="overflow-x-auto rounded-md border border-[#17221c]/10 bg-white">
        <table className="w-full min-w-[900px] table-fixed border-collapse text-left">
          <thead className="border-b border-[#17221c]/10 bg-[#f8f9f7]">
            {table.getHeaderGroups().map((group) => <tr key={group.id}>{group.headers.map((header) => <th key={header.id} style={{ width: header.getSize() }} className="h-12 px-3 text-xs font-semibold uppercase tracking-wide text-[#17221c]/55">
              {header.isPlaceholder ? null : header.column.getCanSort() ? <button type="button" onClick={header.column.getToggleSortingHandler()} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); header.column.getToggleSortingHandler()?.(event); } }} className="flex h-full w-full cursor-pointer items-center justify-between gap-2 text-left">{flexRender(header.column.columnDef.header, header.getContext())}{header.column.getIsSorted() === "asc" ? <ChevronUp className="size-4" /> : header.column.getIsSorted() === "desc" ? <ChevronDown className="size-4" /> : null}</button> : flexRender(header.column.columnDef.header, header.getContext())}
            </th>)}</tr>)}
          </thead>
          <tbody className="divide-y divide-[#17221c]/[0.07]">
            {table.getRowModel().rows.length ? table.getRowModel().rows.map((row) => <tr key={row.id} data-state={row.getIsSelected() ? "selected" : undefined} className="transition-colors hover:bg-[#f6f9f6] data-[state=selected]:bg-[#eaf4ef]">{row.getVisibleCells().map((cell) => <td key={cell.id} className="truncate px-3 py-3.5 text-sm">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>)}</tr>) : <tr><td colSpan={columns.length} className="h-28 text-center text-sm text-[#17221c]/50">No se encontraron pedidos.</td></tr>}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <label className="flex items-center gap-2 text-sm text-[#17221c]/60">Filas por página<select value={table.getState().pagination.pageSize} onChange={(event) => table.setPageSize(Number(event.target.value))} className="h-9 rounded-md border border-[#17221c]/15 bg-white px-2 text-sm text-[#17221c]">{[5, 10, 25, 50].map((size) => <option key={size} value={size}>{size}</option>)}</select></label>
        <div className="flex items-center justify-between gap-4"><p className="text-sm text-[#17221c]/55" aria-live="polite"><span className="font-medium text-[#17221c]">{table.getRowModel().rows.length ? table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1 : 0}-{Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, table.getFilteredRowModel().rows.length)}</span> de <span className="font-medium text-[#17221c]">{table.getFilteredRowModel().rows.length}</span></p><div className="flex items-center gap-1"><Button aria-label="Primera página" size="icon-sm" variant="outline" onPress={() => table.firstPage()} isDisabled={!table.getCanPreviousPage()}><ChevronFirst /></Button><Button aria-label="Página anterior" size="icon-sm" variant="outline" onPress={() => table.previousPage()} isDisabled={!table.getCanPreviousPage()}><ChevronLeft /></Button><Button aria-label="Página siguiente" size="icon-sm" variant="outline" onPress={() => table.nextPage()} isDisabled={!table.getCanNextPage()}><ChevronRight /></Button><Button aria-label="Última página" size="icon-sm" variant="outline" onPress={() => table.lastPage()} isDisabled={!table.getCanNextPage()}><ChevronLast /></Button></div></div>
      </div>

      {selectedOrder && <OrderDetails order={selectedOrder} onClose={() => setSelectedOrder(null)} />}
      {pendingDelete && <ConfirmDeleteDialog count={pendingDelete.length} onCancel={() => setPendingDelete(null)} onConfirm={removePending} />}
    </section>
  );
}

function OrderActions({ row, onView, onMenu, menuOpen, onCopy, onDelete }: { row: Row<AdminOrder>; onView: (order: AdminOrder) => void; onMenu: (id: string | null) => void; menuOpen: boolean; onCopy: () => void; onDelete: () => void }) {
  const order = row.original;
  return <div className="relative flex justify-end"><Button type="button" variant="ghost" size="icon-sm" className="shadow-none" aria-label={`Acciones para ${order.orderNumber}`} aria-expanded={menuOpen} onPress={() => onMenu(menuOpen ? null : order.id)}><Ellipsis /></Button>{menuOpen && <><button type="button" className="fixed inset-0 z-20 cursor-pointer" onClick={() => onMenu(null)} aria-label="Cerrar acciones" /><div className="absolute right-0 top-10 z-30 w-52 rounded-md border border-[#17221c]/10 bg-white p-1.5 shadow-xl"><button type="button" onClick={() => { onView(order); onMenu(null); }} className="flex w-full items-center gap-2 rounded px-2.5 py-2 text-left text-sm hover:bg-[#17221c]/5"><Eye className="size-4" />Ver detalle</button><button type="button" onClick={onCopy} className="flex w-full items-center gap-2 rounded px-2.5 py-2 text-left text-sm hover:bg-[#17221c]/5"><Clipboard className="size-4" />Copiar número</button><div className="my-1 border-t border-[#17221c]/10" /><button type="button" onClick={() => { onDelete(); }} className="flex w-full items-center gap-2 rounded px-2.5 py-2 text-left text-sm text-red-700 hover:bg-red-50"><Trash2 className="size-4" />Quitar de demo</button></div></>}</div>;
}

function OrderDetails({ order, onClose }: { order: AdminOrder; onClose: () => void }) {
  return <div className="fixed inset-0 z-50 flex justify-end bg-black/35" role="presentation" onMouseDown={onClose}><aside className="h-full w-full max-w-lg overflow-y-auto bg-white p-6 shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="order-details-title" onMouseDown={(event) => event.stopPropagation()}><header className="flex items-start justify-between border-b border-[#17221c]/10 pb-5"><div><p className="text-xs font-semibold uppercase tracking-wide text-[#167a63]">Detalle de pedido</p><h2 id="order-details-title" className="mt-1 text-2xl font-bold">{order.orderNumber}</h2></div><Button variant="ghost" size="icon" onPress={onClose} aria-label="Cerrar detalle"><X /></Button></header><section className="space-y-5 py-6"><div><h3 className="font-semibold">Cliente</h3><p className="mt-2">{order.name}</p><p className="text-sm text-[#17221c]/55">{order.email}</p><p className="mt-1 text-sm text-[#17221c]/60">{order.flag} {order.location}</p></div><div className="grid grid-cols-2 gap-4"><div><p className="text-xs uppercase text-[#17221c]/45">Estado</p><p className="mt-1 font-medium">{order.status}</p></div><div><p className="text-xs uppercase text-[#17221c]/45">Creado</p><p className="mt-1 text-sm">{dateTime(order.createdAt)}</p></div><div><p className="text-xs uppercase text-[#17221c]/45">Entrega</p><p className="mt-1 text-sm">{order.deliveryType}</p></div><div><p className="text-xs uppercase text-[#17221c]/45">Pago</p><p className="mt-1 text-sm">{order.paymentMethod}</p></div></div><div><p className="text-xs uppercase text-[#17221c]/45">Dirección / retiro</p><p className="mt-1 text-sm">{order.address}</p></div><div><h3 className="font-semibold">Productos</h3><div className="mt-2 divide-y divide-[#17221c]/10">{order.items.map((item) => <div key={item.name} className="flex justify-between gap-3 py-3 text-sm"><span>{item.quantity} × {item.name}</span><span className="font-medium">{currency(item.quantity * item.unitPrice)}</span></div>)}</div><div className="flex justify-between border-t border-[#17221c]/10 pt-4 font-bold"><span>Total</span><span>{currency(order.balance)}</span></div></div></section></aside></div>;
}

function ConfirmDeleteDialog({ count, onCancel, onConfirm }: { count: number; onCancel: () => void; onConfirm: () => void }) {
  return <div className="fixed inset-0 z-[60] grid place-items-center bg-black/40 p-4" role="presentation" onMouseDown={onCancel}><section role="alertdialog" aria-modal="true" aria-labelledby="delete-title" className="w-full max-w-md rounded-md bg-white p-6 shadow-2xl" onMouseDown={(event) => event.stopPropagation()}><div className="mb-4 flex size-10 items-center justify-center rounded-full bg-red-50 text-red-700"><Trash2 className="size-5" /></div><h2 id="delete-title" className="text-lg font-bold">¿Confirmás esta acción?</h2><p className="mt-2 text-sm leading-6 text-[#17221c]/60">Se quitarán {count} pedido(s) del conjunto de demostración. Esta acción no modifica pedidos reales.</p><div className="mt-6 flex justify-end gap-2"><Button variant="outline" onPress={onCancel}>Cancelar</Button><Button variant="destructive" onPress={onConfirm}>Quitar de demo</Button></div></section></div>;
}

export function getDemoOrders() {
  return DEMO_ORDERS;
}

export function getOrderMetrics(orders: AdminOrder[]) {
  const active = orders.filter((order) => order.status === "Pendiente" || order.status === "Preparando" || order.status === "Enviado");
  const completed = orders.filter((order) => order.status === "Entregado");
  const grossSales = completed.reduce((sum, order) => sum + order.balance, 0);
  const averageOrder = completed.length ? Math.round(grossSales / completed.length) : 0;
  return { total: orders.length, active: active.length, grossSales, averageOrder, completed: completed.length };
}

export function AdminDashboard() {
  const [orders, setOrders] = useState(DEMO_ORDERS);
  const metrics = getOrderMetrics(orders);
  const dailyBars = [42, 58, 36, 73, 54, 88, 66];
  const bars = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

  return <div className="min-h-[calc(100vh-4rem)] bg-[#f5f7f5] text-[#17221c]"><div className="mx-auto flex max-w-[1500px] flex-col lg:flex-row"><aside className="border-b border-[#17221c]/10 bg-white px-4 py-4 lg:min-h-[calc(100vh-4rem)] lg:w-60 lg:shrink-0 lg:border-b-0 lg:border-r lg:px-5 lg:py-7"><div className="mb-7 flex items-center gap-3"><span className="grid size-9 place-items-center rounded-md bg-[#e8f3ed] text-[#167a63]"><ShoppingBag className="size-5" /></span><div><p className="font-bold">Wuff Admin</p><p className="text-xs text-[#17221c]/45">Operaciones</p></div></div><nav className="flex gap-2 overflow-x-auto lg:flex-col" aria-label="Administración"><a href="#resumen" className="rounded-md bg-[#eaf4ef] px-3 py-2.5 text-sm font-semibold text-[#167a63]">Resumen</a><a href="#pedidos" className="rounded-md px-3 py-2.5 text-sm font-medium text-[#17221c]/60 hover:bg-[#17221c]/5">Pedidos</a><a href="#metricas" className="rounded-md px-3 py-2.5 text-sm font-medium text-[#17221c]/60 hover:bg-[#17221c]/5">Métricas</a></nav></aside><main className="min-w-0 flex-1 space-y-7 p-4 sm:p-6 lg:p-8"><header id="resumen" className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><p className="text-sm font-medium text-[#167a63]">Panel de administración</p><h1 className="mt-1 text-3xl font-bold tracking-tight">Resumen de pedidos</h1><p className="mt-2 text-sm text-[#17221c]/55">Seguimiento de ventas, clientes y cumplimiento.</p></div><span className="inline-flex w-fit items-center gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800"><Activity className="size-4" />Datos de demostración</span></header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Métricas de pedidos">
        <MetricCard title="Pedidos totales" value={metrics.total.toLocaleString("es-AR")} delta="12,4%" positive icon={<ShoppingBag className="size-4" />} comparison="vs. período anterior" />
        <MetricCard title="Pedidos activos" value={metrics.active.toLocaleString("es-AR")} delta="3,2%" positive icon={<Truck className="size-4" />} comparison="pendientes, preparación y envío" />
        <MetricCard title="Ventas entregadas" value={currency(metrics.grossSales)} delta="8,6%" positive icon={<Wallet className="size-4" />} comparison={`${metrics.completed} pedidos completados`} />
        <MetricCard title="Ticket promedio" value={currency(metrics.averageOrder)} delta="1,8%" positive={false} icon={<PackageCheck className="size-4" />} comparison="sobre pedidos entregados" />
      </section>

      <section id="metricas" className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.8fr)]">
        <article className="rounded-md border border-[#17221c]/10 bg-white p-5"><div className="flex items-start justify-between gap-3"><div><h2 className="font-semibold">Actividad semanal</h2><p className="mt-1 text-sm text-[#17221c]/50">Pedidos recibidos · últimos 7 días</p></div><span className="rounded-md bg-[#f3f6f3] px-2.5 py-1 text-xs text-[#17221c]/60">Esta semana</span></div><div className="mt-7 flex h-40 items-end justify-between gap-3 border-b border-l border-[#17221c]/10 px-2"><div className="absolute" /><div className="contents">{dailyBars.map((height, index) => <div key={bars[index]} className="flex h-full flex-1 flex-col items-center justify-end gap-2"><span className="text-[10px] text-[#17221c]/45">{Math.round(height * 0.18)}</span><div className={`w-full max-w-10 rounded-t-sm ${index === 5 ? "bg-[#167a63]" : "bg-[#dceae1]"}`} style={{ height: `${height}%` }} /><span className="translate-y-6 text-[10px] text-[#17221c]/50">{bars[index]}</span></div>)}</div></div></article>
        <article className="rounded-md border border-[#17221c]/10 bg-white p-5"><div><h2 className="font-semibold">Estado de pedidos</h2><p className="mt-1 text-sm text-[#17221c]/50">Distribución actual</p></div><div className="mt-6 space-y-4">{statuses.map((status) => { const count = orders.filter((order) => order.status === status).length; const percent = orders.length ? Math.round(count / orders.length * 100) : 0; return <div key={status}><div className="mb-1.5 flex justify-between text-sm"><span>{status}</span><span className="font-medium">{count} <span className="text-[#17221c]/40">({percent}%)</span></span></div><div className="h-2 overflow-hidden rounded-full bg-[#eef1ee]"><div className="h-full rounded-full bg-[#167a63]" style={{ width: `${percent}%` }} /></div></div>; })}</div></article>
      </section>

      <div id="pedidos" className="rounded-md border border-[#17221c]/10 bg-white p-4 sm:p-5"><OrdersTable data={orders} onDataChange={setOrders} /></div>
      <p className="text-xs leading-5 text-[#17221c]/45">Las métricas y los pedidos mostrados son datos de demostración para revisar el dashboard. Todavía no representan transacciones reales.</p>
    </main></div></div>;
}

function MetricCard({ title, value, delta, positive, icon, comparison }: { title: string; value: string; delta: string; positive: boolean; icon: React.ReactNode; comparison: string }) {
  return <article className="rounded-md border border-[#17221c]/10 bg-white p-5"><div className="flex items-center justify-between"><p className="text-sm font-medium text-[#17221c]/55">{title}</p><span className="grid size-8 place-items-center rounded-md bg-[#f2f6f3] text-[#167a63]">{icon}</span></div><div className="mt-4 flex items-end justify-between gap-2"><p className="text-2xl font-bold tracking-tight">{value}</p><span className={`mb-0.5 inline-flex items-center gap-1 text-xs font-semibold ${positive ? "text-emerald-700" : "text-red-700"}`}>{positive ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}{delta}</span></div><p className="mt-2 text-xs text-[#17221c]/45">{comparison}</p></article>;
}