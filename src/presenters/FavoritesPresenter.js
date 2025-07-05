export class FavoritesPresenter {
    constructor(model, view) {
      this.model = model
      this.view = view
    }
  
    async init() {
      this.view.onStoryCardClick((storyId) => this.handleStoryClick(storyId))
      this.view.onRemoveFromFavorites((storyId) => this.handleRemoveFromFavorites(storyId))
      this.view.onClearFavorites(() => this.handleClearFavorites())
      this.view.onExportFavorites(() => this.handleExportFavorites())
  
      await this.loadFavorites()
    }
  
    async loadFavorites() {
      try {
        this.view.showLoading()
        const favorites = await this.model.getFavorites()
        this.view.renderFavorites(favorites)
      } catch (error) {
        console.error("Error loading favorites:", error)
        this.view.showError("Gagal memuat cerita favorit.")
      }
    }
  
    async handleStoryClick(storyId) {
      try {
        const story = await window.indexedDBService.getStoryById(storyId)
        if (story) {
           this.view.showStoryDetail(story);
        }
      } catch (error) {
        console.error("Error fetching story details:", error)
        this.view.showAlert("Gagal memuat detail cerita")
      }
    }
  
    async handleRemoveFromFavorites(storyId) {
      if (this.view.confirmAction("Hapus cerita ini dari favorit?")) {
        try {
          await this.model.removeFromFavorites(storyId)
          await this.loadFavorites()
          this.view.showSuccessMessage("Cerita dihapus dari favorit")
        } catch (error) {
          console.error("Error removing from favorites:", error)
          this.view.showAlert("Gagal menghapus cerita dari favorit.")
        }
      }
    }
  
    async handleClearFavorites() {
      const favorites = await this.model.getFavorites()
      if (favorites.length === 0) {
        this.view.showAlert("Tidak ada favorit untuk dihapus.")
        return
      }
  
      if (this.view.confirmAction(`Hapus semua ${favorites.length} cerita favorit? Tindakan ini tidak dapat dibatalkan.`)) {
        try {
          for (const favorite of favorites) {
            await this.model.removeFromFavorites(favorite.id)
          }
  
          await this.loadFavorites()
          this.view.showSuccessMessage("Semua favorit telah dihapus.")
        } catch (error) {
          console.error("Error clearing favorites:", error)
          this.view.showAlert("Gagal menghapus semua favorit.")
        }
      }
    }
  
    async handleExportFavorites() {
      try {
        const favorites = await this.model.getFavorites()
  
        if (favorites.length === 0) {
          this.view.showAlert("Tidak ada favorit untuk diekspor.")
          return
        }
  
        const exportData = {
          exportDate: new Date().toISOString(),
          totalFavorites: favorites.length,
          favorites: favorites.map((story) => ({
            id: story.id,
            name: story.name || story.title,
            description: story.description,
            location: story.lat && story.lon ? `${story.lat}, ${story.lon}` : null,
            createdAt: story.createdAt,
            addedToFavoritesAt: story.addedAt,
            photoUrl: story.photoUrl,
          })),
        }
        
        const fileName = `story-explorer-favorites-${new Date().toISOString().split("T")[0]}.json`;
        this.view.downloadFile(exportData, fileName)
        this.view.showSuccessMessage("Favorit berhasil diekspor.")
      } catch (error) {
        console.error("Error exporting favorites:", error)
        this.view.showAlert("Gagal mengekspor favorit.")
      }
    }
  
    destroy() {
    }
}