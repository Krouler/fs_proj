from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsAuthenticatedOrIsOwnerOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if request.user.is_authenticated:
            return True
        return request.method in SAFE_METHODS

    def has_object_permission(self, request, view, obj):
        if request.user.is_authenticated:
            if request.method in ('PUT', 'PATCH', 'DELETE'):
                return request.user == obj.user
        return request.method in SAFE_METHODS
