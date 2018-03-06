# Stick that at the end of .git/hooks/pre-commit

git_output=`git grep -n -i "todo\|fixme"`
# A TODO has been found that should be addressed
if [ $? -eq 0 ]; then
    echo "Please address the following TODOs. To ignore use --no-verify."
    echo
    echo $git_output
    exit 1
fi