import fetch from "@/plugin/axios"
import { loadingProvider } from "@/provider/loading"
import { ElMessage, ElMessageBox } from "element-plus"

export function useListPage({ filter, url, extendFilter, withLoading = true }) {
  const _list = ref([])
  const _filter = ref({ ...filter })
  const _pagination = ref({
    page: 1,
    size: 10,
    total: 0,
  })
  function _getList() {
    if (withLoading) {
      loadingProvider.show()
    }
    const params = {
      ..._sort.value,
      ..._filter.value,
      page: _pagination.value.page,
      size: _pagination.value.size,
    }
    if (extendFilter) {
      Object.assign(params, extendFilter())
    }
    return fetch
      .get(url, { params })
      .then((res) => {
        _list.value = res.list || []
        _pagination.value.total = Number(res.pagination?.total || 0)
        return res
      })
      .finally(() => {
        if (withLoading) {
          loadingProvider.hide()
        }
      })
  }
  function _handleExport() {
    loadingProvider.lock()
    const body = { ..._filter.value }
    if (extendFilter) {
      Object.assign(body, extendFilter())
    }
    return fetch
      .post(`${url}/export`, body)
      .then((res) => {
        window.open(res)
      })
      .finally(() => {
        loadingProvider.hide()
      })
  }
  function _handleSearch() {
    _list.value = []
    _pagination.value.page = 1
    return _getList()
  }
  function _handleReset() {
    _filter.value = { ...filter }
    return _handleSearch()
  }
  const _sort = ref({
    sortKey: "",
    sortType: "",
  })
  function _onSortChange({ column, prop, order }) {
    _sort.value.sortKey = prop
    _sort.value.sortType = order
    return _handleSearch()
  }
  function _handleDelete(row) {
    const id = row?._id || row?.id || row
    const name = row?.name || row?.title
    let msg = `确定要删除当前内容吗?`
    if (name) {
      msg = `确定要删除【${name}】吗?`
    }
    ElMessageBox.confirm(msg).then(() => {
      return fetch.delete(`${url}/${id}`).then(() => {
        ElMessage.success("操作成功")
        return _handleReset()
      })
    })
  }
  return {
    list: _list,
    pagination: _pagination,
    filter: _filter,
    getList: _getList,
    handleExport: _handleExport,
    handleSearch: _handleSearch,
    handleReset: _handleReset,
    handleDelete: _handleDelete,
    sort: _sort,
    onSortChange: _onSortChange,
  }
}

export function useEditDialog() {
  const _isShowEdit = ref(false)
  const _currentEditId = ref("")
  const _isViewMode = ref(false)
  function _handleAdd() {
    _currentEditId.value = ""
    _isViewMode.value = false
    _isShowEdit.value = true
  }
  function _handleEdit(row) {
    _currentEditId.value = row?._id || row?.id || row
    _isViewMode.value = false
    _isShowEdit.value = true
  }
  function _handleView(row) {
    _currentEditId.value = row?._id || row?.id || row
    _isViewMode.value = true
    _isShowEdit.value = true
  }
  return {
    isShowEdit: _isShowEdit,
    currentEditId: _currentEditId,
    isViewMode: _isViewMode,
    handleAdd: _handleAdd,
    handleEdit: _handleEdit,
    handleView: _handleView,
  }
}
