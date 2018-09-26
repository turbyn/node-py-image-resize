from PIL import Image
import sys

im = Image.open(sys.argv[1]);
newSize = (int(sys.argv[2]), int(sys.argv[3]));

newImage = im.resize(newSize)
newImage.save(sys.argv[1]);
print("DONE");
