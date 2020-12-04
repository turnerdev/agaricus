{ pkgs ? import <nixpkgs> {} }:
  pkgs.mkShell {
    buildInputs = with pkgs; [ nodejs-14_x yarn nodePackages.lerna ];
}
