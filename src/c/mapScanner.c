#include <stdio.h>

#define DEBUG1

void myimage(unsigned char *const in, unsigned char *out, int width, int height) {
#ifdef DEBUG
  printf("Inside C function: width: %d, height: %d\n", width, height);
#endif
  int row = 0;
  int col = 0;
  // width index for the out array
  int colout = 0;
  int c = 0;
  int pos = 0;
  // position index for the out array
  int posout = 0;

  const int channels = 4;
  // the data has more than one channel per pixel, projected into a 1d array
  // the actual 'width' of the image would then be the normal width multiplied by the number of channels
  const int widthWithChannels = width * channels;
#ifdef DEBUG
  printf("Current height: %d, %d\n", row, row < height);
#endif

  // do a row-major iteration by looping over every row
  for (row = 0; row < height; ++row) {
#ifdef DEBUG
    printf("Inside first loop\n");
#endif
    // loop over every column
    for (col = 0, colout = 0; colout < width; col += channels, ++colout) {
      pos = row * widthWithChannels + col;
      posout = row * width + colout;
#ifdef DEBUG
      printf("in[%d] ", pos);
      printf("red %d: %d, green %d: %d, blue %d: %d alpha %d: %d ", pos, in[pos], pos + 1, in[pos + 1], pos + 2,
             in[pos + 2], pos + 3, in[pos + 3]);
#endif

      // the alpha is not used in the grayscale calculation
      out[posout] = (in[pos] + in[pos + 1] + in[pos + 2]) / 3;
#ifdef DEBUG
      printf("out[%d]: %d\n", posout, out[posout]);
#endif
    }
  }
}