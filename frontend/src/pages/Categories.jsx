import { useMemo, useState } from "react";
import { IoPencilOutline, IoPricetagsOutline, IoAdd, IoSearchOutline } from "react-icons/io5";
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
      toast.error("Please enter a category name");
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
      toast.success("Category renamed successfully");
      setEditing(null);
      categories.refetch();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSavingEdit(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold tracking-tight text-light-textPrimary sm:text-2xl">
              Categories
            </h2>
            <span className="rounded-full bg-light-surfaceSecondary px-2.5 py-0.5 text-xs font-semibold text-light-textSecondary">
              {meta?.totalDocs ?? list.length}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-light-textMuted">
            Create and manage categories to organise your financial activity
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <IoSearchOutline className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-light-textMuted text-sm" />
          <input
            type="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search categories…"
            aria-label="Search categories"
            className={`${inputClasses} pl-8 py-2 text-xs`}
          />
        </div>
      </div>

      {/* Inline Quick-Add Category Bar */}
      <form onSubmit={handleCreate} className={`${cardClasses} p-2.5 sm:p-3`}>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Add new category (e.g. Groceries, Subscriptions, Salary)…"
            maxLength={60}
            className={`${inputClasses} py-2 text-xs flex-1`}
          />
          <button
            type="submit"
            disabled={creating || !newName.trim()}
            className={`${buttonPrimary} py-2 px-3.5 text-xs shrink-0`}
          >
            {creating ? <Spinner className="h-3.5 w-3.5" /> : <IoAdd className="text-base" />}
            <span>{creating ? "Adding…" : "Add"}</span>
          </button>
        </div>
      </form>

      {/* Error Banner */}
      {categories.error && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-semantic-danger/30 bg-semantic-danger/10 px-4 py-3 text-xs text-semantic-danger">
          <span>Could not load categories: {categories.error}</span>
          <button
            type="button"
            onClick={categories.refetch}
            className="shrink-0 font-semibold hover:underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Categories Grid */}
      {loading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className={`${cardClasses} p-4`}>
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-xl" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3.5 w-24" />
                  <Skeleton className="h-2.5 w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : list.length === 0 ? (
        <div className={cardClasses}>
          <EmptyState
            icon={<IoPricetagsOutline className="text-xl" />}
            title={search ? "No categories found" : "No categories created yet"}
            description={
              search
                ? "Try searching with a different term."
                : "Create your first category above to accurately classify your transactions."
            }
          />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {list.map((category) => (
              <div
                key={category._id}
                className={`${cardClasses} group flex items-center justify-between p-3.5 transition-all hover:border-brand-primary/40 hover:bg-light-surfaceSecondary/30`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <CategoryIcon name={category.name} size="md" />
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-light-textPrimary">
                      {category.name}
                    </p>
                    <p className="truncate text-[10px] text-light-textMuted">
                      Added {formatDate(category.createdAt)}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => openRename(category)}
                  aria-label={`Rename category ${category.name}`}
                  className="rounded-lg p-1.5 text-light-textMuted opacity-0 transition group-hover:opacity-100 hover:bg-light-surfaceSecondary hover:text-brand-primary"
                >
                  <IoPencilOutline className="text-sm" aria-hidden="true" />
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
        </div>
      )}

      {/* Rename Category Modal */}
      <Modal
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        title="Rename Category"
        description="Updated name will be reflected across your transactions"
        size="sm"
        footer={
          <div className="flex items-center justify-end gap-2">
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
              {savingEdit && <Spinner className="h-3.5 w-3.5" />}
              <span>{savingEdit ? "Saving…" : "Save name"}</span>
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
              onChange={(e) => setEditName(e.target.value)}
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
