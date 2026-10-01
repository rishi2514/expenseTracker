import { useMemo, useState } from "react";
import { IoPencilOutline, IoPricetagsOutline, IoAddOutline } from "react-icons/io5";
import useFetch from "../hooks/useFetch";
import useToast from "../hooks/useToast";
import { createCategory, getCategories, updateCategory } from "../api/categories";
import CategoryIcon from "../components/CategoryIcon";
import Modal from "../components/Modal";
import Field from "../components/Field";
import Pagination from "../components/Pagination";
import EmptyState from "../components/EmptyState";
import { Skeleton, Spinner } from "../components/Spinner";
import { CATEGORY_PAGE_SIZE } from "../utils/constants";
import { formatDate } from "../utils/format";
import { getErrorMessage } from "../utils/error";
import {
  buttonPrimary,
  buttonSecondary,
  cardClasses,
  inputClasses,
} from "../utils/styles";

const Categories = () => {
  const toast = useToast();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);

  const [editing, setEditing] = useState(null);
  const [editName, setEditName] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  const params = useMemo(
    () => ({ page, limit: CATEGORY_PAGE_SIZE, name: search.trim() || undefined }),
    [page, search]
  );
  const categories = useFetch(() => getCategories(params), params);

  const list = categories.data || [];
  const meta = categories.meta;
  const loading = categories.loading;

  const handleCreate = async (event) => {
    event.preventDefault();
    const name = newName.trim();
    if (!name) {
      toast.error("Enter a category name");
      return;
    }
    setCreating(true);
    try {
      await createCategory(name);
      toast.success(`Category "${name}" created`);
      setNewName("");
      categories.refetch();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setCreating(false);
    }
  };

  const openRename = (category) => {
    setEditing(category);
    setEditName(category.name);
  };

  const handleRename = async (event) => {
    event.preventDefault();
    const name = editName.trim();
    if (!name) {
      toast.error("Category name cannot be empty");
      return;
    }
    setSavingEdit(true);
    try {
      await updateCategory(editing._id, name);
      toast.success("Category renamed");
      setEditing(null);
      categories.refetch();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSavingEdit(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-light-textPrimary">
            Your categories
          </h2>
          <p className="mt-0.5 text-sm text-light-textSecondary">
            {loading
              ? "Loading…"
              : `${meta?.totalDocs ?? list.length} categor${(meta?.totalDocs ?? list.length) === 1 ? "y" : "ies"}`}
          </p>
        </div>
        <div className="w-full sm:w-64">
          <input
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search categories…"
            aria-label="Search categories"
            className={inputClasses}
          />
        </div>
      </div>

      {/* Create form */}
      <form onSubmit={handleCreate} className={`${cardClasses} p-4`}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <Field
            label="New category"
            htmlFor="new-category"
            hint="Examples: Food, Rent, Salary, Travel"
            className="flex-1"
          >
            <input
              id="new-category"
              type="text"
              value={newName}
              onChange={(event) => setNewName(event.target.value)}
              placeholder="e.g. Groceries"
              maxLength={60}
              className={inputClasses}
            />
          </Field>
          <button
            type="submit"
            disabled={creating}
            className={`${buttonPrimary} sm:mb-0.5`}
          >
            {creating ? <Spinner className="h-4 w-4" /> : <IoAddOutline className="text-lg" aria-hidden="true" />}
            {creating ? "Adding…" : "Add category"}
          </button>
        </div>
      </form>

      {/* Error banner */}
      {categories.error && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-semantic-danger/30 bg-semantic-danger/5 px-4 py-3 text-sm text-semantic-danger">
          <span className="min-w-0 truncate">
            Could not load categories: {categories.error}
          </span>
          <button
            type="button"
            onClick={categories.refetch}
            className="shrink-0 font-semibold hover:underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className={`${cardClasses} p-4`}>
              <div className="flex items-center gap-3">
                <Skeleton className="h-12 w-12 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : list.length === 0 ? (
        <div className={cardClasses}>
          <EmptyState
            icon={<IoPricetagsOutline className="text-2xl" />}
            title={search ? "No categories match your search" : "No categories yet"}
            description={
              search
                ? "Try a different keyword."
                : "Categories make reports useful — create your first one above (Food, Rent, Salary…)."
            }
          />
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {list.map((category) => (
              <div
                key={category._id}
                className={`${cardClasses} group flex items-center gap-3 p-4 transition hover:border-brand-primary/40`}
              >
                <CategoryIcon name={category.name} size="lg" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-light-textPrimary">
                    {category.name}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-light-textMuted">
                    Added {formatDate(category.createdAt)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => openRename(category)}
                  aria-label={`Rename category ${category.name}`}
                  className="rounded-lg p-2 text-light-textMuted opacity-0 transition group-hover:opacity-100 hover:bg-light-surfaceSecondary hover:text-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                >
                  <IoPencilOutline aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>

          <div className={cardClasses}>
            <Pagination
              page={meta?.page || page}
              totalPages={meta?.totalPages || 1}
              totalDocs={meta?.totalDocs}
              limit={meta?.limit || CATEGORY_PAGE_SIZE}
              onPageChange={setPage}
            />
          </div>
        </>
      )}

      {/* Rename modal */}
      <Modal
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        title="Rename category"
        description="The new name applies to future transactions."
        size="sm"
        footer={
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => setEditing(null)}
              disabled={savingEdit}
              className={buttonSecondary}
            >
              Cancel
            </button>
            <button
              type="submit"
              form="rename-category-form"
              disabled={savingEdit}
              className={buttonPrimary}
            >
              {savingEdit && <Spinner className="h-4 w-4" />}
              {savingEdit ? "Saving…" : "Save name"}
            </button>
          </div>
        }
      >
        <form id="rename-category-form" onSubmit={handleRename}>
          <Field label="Category name" htmlFor="rename-category" required>
            <input
              id="rename-category"
              type="text"
              value={editName}
              onChange={(event) => setEditName(event.target.value)}
              maxLength={60}
              autoFocus
              className={inputClasses}
            />
          </Field>
        </form>
      </Modal>
    </div>
  );
};

export default Categories;
