#!/usr/sbin/dtrace -s

#pragma D option quiet

profile-1ms /pid == $target/ {
  /* Sampling every 1ms therefore also recording timestamp at ms resolution */
  printf("%s %d %d: %s:", execname, pid, timestamp / 1000000, probename);
  ustack(10000);
  printf("\n");
}
