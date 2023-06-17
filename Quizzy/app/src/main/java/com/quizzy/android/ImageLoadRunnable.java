package com.quizzy.android;

import android.net.Uri;
import android.os.Handler;
import android.widget.ImageView;

import androidx.annotation.NonNull;

import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.firebase.storage.StorageReference;
import com.squareup.picasso.Picasso;

public class ImageLoadRunnable implements Runnable {
    private static final long RETRY_DELAY = 1000; // Retry time

    private ImageView imageView;
    private StorageReference imageRef;

    public ImageLoadRunnable(ImageView imageView, StorageReference imageRef) {
        this.imageView = imageView;
        this.imageRef = imageRef;
    }

    @Override
    public void run() {
        imageRef.getDownloadUrl().addOnSuccessListener(new OnSuccessListener<Uri>() {
            @Override
            public void onSuccess(Uri uri) {
                // Load the image using Picasso
                Picasso.get().load(uri).into(imageView);
                System.out.println("Image loaded successfully!");
            }
        }).addOnFailureListener(new OnFailureListener() {
            @Override
            public void onFailure(@NonNull Exception exception) {
                // Handle any errors that occur during image retrieval
                // Retry loading the image after a delay
                System.out.println("Failed to load image. Retrying...");
                Handler handler = new Handler();
                handler.postDelayed(ImageLoadRunnable.this, RETRY_DELAY);
            }
        });
    }
}
