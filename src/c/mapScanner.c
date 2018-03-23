#include <stdio.h>
#include <math.h>

double* displayArray(double *doubleVector, int w, int h) {
    printf("Width: %d, Height: %d", w, h);

   for (int cnt = 0; cnt < 3; cnt++) 
       printf("doubleVector[%d] = %f\n", cnt, doubleVector[cnt]);

   doubleVector[0] = 98;
   doubleVector[1] = 99;
   doubleVector[2] = 100;

   for (int cnt1 = 0; cnt1 < 3; cnt1++) 
       printf("modified doubleVector[%d] = %f\n", cnt1, doubleVector[cnt1]);

   return doubleVector;
}
unsigned char* myimage(unsigned char *image, int w, int h) {
    printf("Width: %d, Height: %d\n", w, h);

   for (int cnt = 0; cnt < w; ++cnt) 
       printf("image[%d] = %d\n", cnt, image[cnt]);

   return image;
}