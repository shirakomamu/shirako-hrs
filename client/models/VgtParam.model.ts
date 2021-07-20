import { Model } from "@vuex-orm/core";
import { cloneDeep } from "lodash";

export default class extends Model {
  static entity = "vgtParam";

  public id!: string;
  public sort!: { field: string; type: "asc" | "desc" }[];
  public page!: number;
  public perPage!: number;
  public perPageOptions!: number[];
  public searchTerm!: string | null;
  public columnFilters!: { [key: string]: string };
  public custom?: any;

  public static fields() {
    return {
      id: this.string(null),
      sort: this.attr([]),
      page: this.number(null).nullable(),
      perPage: this.number(null).nullable(),
      perPageOptions: this.attr([]),
      searchTerm: this.string(null).nullable(),
      columnFilters: this.attr({}),
      custom: this.attr({}),
    };
  }

  public get apiParams() {
    const validFilters: { [key: string]: string } = {};
    for (const filter of Object.keys(this.columnFilters)) {
      if (this.columnFilters[filter]) {
        validFilters[filter] = this.columnFilters[filter];
      }
    }
    const validCustom: { [key: string]: string } = {};
    for (const filter of Object.keys(this.custom)) {
      if (this.custom[filter]) {
        validCustom[filter] = this.custom[filter];
      }
    }

    return {
      sort: this.sort.length
        ? this.sort.map((e) => e.field + ":" + e.type)
        : undefined,
      page: this.page !== null ? this.page : undefined,
      perPage: this.perPage !== null ? this.perPage : undefined,
      searchTerm:
        this.searchTerm !== null ? encodeURI(this.searchTerm) : undefined,
      columnFilters: Object.keys(validFilters).length
        ? encodeURI(JSON.stringify(validFilters))
        : undefined,
      ...validCustom,
    };
  }

  public static updateParams({
    id,
    sort,
    page,
    perPage,
    perPageOptions,
    searchTerm,
    columnFilters,
    custom,
  }: {
    id: string;
    sort?: { field: string; type: "asc" | "desc" }[];
    page?: number;
    perPage?: number;
    perPageOptions?: number[];
    searchTerm?: string;
    columnFilters?: { [key: string]: string };
    custom?: any;
  }) {
    const thisRecord = this.find(id);
    if (!thisRecord) {
      this.insert({
        data: {
          id,
          sort,
          page,
          perPage,
          perPageOptions,
          searchTerm,
          columnFilters,
          custom,
        },
      });
    } else {
      this.update({
        where: id,
        data: {
          id,
          sort: typeof sort === "undefined" ? thisRecord.sort : sort,
          page: typeof page === "undefined" ? thisRecord.page : page,
          perPage:
            typeof perPage === "undefined" ? thisRecord.perPage : perPage,
          searchTerm:
            typeof searchTerm === "undefined"
              ? thisRecord.searchTerm
              : searchTerm,
          columnFilters:
            typeof columnFilters === "undefined"
              ? thisRecord.columnFilters
              : columnFilters,
          custom:
            typeof custom === "undefined"
              ? thisRecord.custom
              : Object.assign(cloneDeep(thisRecord.custom), custom),
        },
      });
    }
  }
}
