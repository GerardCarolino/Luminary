from django.contrib import admin
from .models import Album, Photo, Collaborator

@admin.register(Album)
class AlbumAdmin(admin.ModelAdmin):
    list_display  = ['title', 'owner', 'visibility', 'photo_count', 'created_at']
    list_filter   = ['visibility']
    search_fields = ['title', 'owner__username']

@admin.register(Photo)
class PhotoAdmin(admin.ModelAdmin):
    list_display  = ['__str__', 'album', 'uploaded_by', 'uploaded_at']
    search_fields = ['caption', 'album__title']

@admin.register(Collaborator)
class CollaboratorAdmin(admin.ModelAdmin):
    list_display = ['user', 'album', 'role', 'added_at']
    list_filter  = ['role']