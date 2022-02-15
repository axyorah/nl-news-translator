from django.dispatch import receiver
from django.db.models.signals import post_save, post_delete

from django.contrib.auth.models import User
from users.models import Profile

@receiver(post_save, sender=User)
def createProfile(sender, instance, created, **kwargs):
    if created:
        user = instance
        profile = Profile.objects.create(
            user=user,
            username=user.username,
        )
   
@receiver(post_delete, sender=Profile)
def deleteUser(sender, instance, **kwargs):
    user = instance.user
    user.delete()
    print(f'User and Profile `{instance}` deleted!')

@receiver(post_save, sender=Profile)
def profileUpdated(sender, instance, created, **kwargs):
    # this is for debugging purposes only...
    print('Profile Saved!')
    print(f'Sender: {sender}\nInstance: {instance}\nCreated: {created}')
 