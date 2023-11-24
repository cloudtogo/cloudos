package com.appsmith.external.git;

import com.appsmith.external.dtos.GitBranchDTO;
import com.appsmith.external.dtos.GitLogDTO;
import com.appsmith.external.dtos.GitStatusDTO;
import com.appsmith.external.dtos.MergeStatusDTO;
import org.eclipse.jgit.api.errors.GitAPIException;
import org.eclipse.jgit.lib.BranchTrackingStatus;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.io.IOException;
import java.nio.file.Path;
import java.util.List;

@Component
public interface GitExecutor {

    /**
     * This method will handle the git-commit functionality. Under the hood it checks if the repo has already been
     * initialised
     * @param repoPath      parent path to repo
     * @param commitMessage message which will be registered for this commit
     * @param authorName    author details
     * @param authorEmail   author details
     * @param doAmend       To amend with the previous commit
     * @return if the commit was successful
     */
    Mono<String> commitApplication(
            Path repoPath,
            String commitMessage,
            String authorName,
            String authorEmail,
            boolean isSuffixedPath,
            boolean doAmend);

    /**
     * Method to get the commit history
     * @param suffix suffixedPath used to generate the base repo path this includes orgId, defaultAppId, repoName
     * @return list of git commits
     */
    Mono<List<GitLogDTO>> getCommitHistory(Path suffix);

    /**
     * Method to create a new repository to provided path
     * @param repoPath path where new repo needs to be created
     * @return if the operation was successful
     */
    boolean createNewRepository(Path repoPath) throws GitAPIException;

    /**
     * Method to push changes to remote repo
     *
     * @param branchSuffix Path used to generate the repo url specific to the application which needs to pushed to remote
     * @param remoteUrl remote repo url
     * @param publicKey generated by us and specific to the defaultApplication
     * @param privateKey generated by us and specific to the defaultApplication
     * @return Success message
     */
    Mono<String> pushApplication(
            Path branchSuffix, String remoteUrl, String publicKey, String privateKey, String branchName);

    /** Clone the repo to the file path : container-volume/orgId/defaultAppId/repo/applicationData
     *
     *  @param repoSuffix combination of orgId, defaultId and repoName
     *  @param remoteUrl ssh url of the git repo(we support cloning via ssh url only with deploy key)
     *  @param privateKey generated by us and specific to the defaultApplication
     *  @param publicKey generated by us and specific to the defaultApplication
     *  @return defaultBranchName of the repo
     * */
    Mono<String> cloneApplication(Path repoSuffix, String remoteUrl, String privateKey, String publicKey);

    /**
     * Create a new branch in the local repo and checkout to that branch
     *
     * @param repoSuffix suffixedPath used to generate the base repo path this includes orgId, defaultAppId, repoName
     * @param branchName branch which needs to be created
     * @return created branch name
     */
    Mono<String> createAndCheckoutToBranch(Path repoSuffix, String branchName);

    /**
     * Delete a branch in the local repo
     *
     * @param repoSuffix suffixedPath used to generate the base repo path this includes orgId, defaultAppId, repoName
     * @param branchName branch which needs to be deleted
     * @return deleted branch name
     */
    Mono<Boolean> deleteBranch(Path repoSuffix, String branchName);

    /**
     * Git checkout to specific branch
     *
     * @param repoSuffix suffixedPath used to generate the base repo path this includes orgId, defaultAppId, repoName
     * @param branchName name of the branch which needs to be checked out
     * @return if the operation is successful
     */
    Mono<Boolean> checkoutToBranch(Path repoSuffix, String branchName);

    /**
     * Pull changes from remote branch and merge the changes
     * @param repoSuffix suffixedPath used to generate the base repo path this includes orgId, defaultAppId, repoName
     * @param remoteUrl ssh url of the git repo(we support cloning via ssh url only with deploy key)
     * @param branchName remoteBranchName from which commits will be fetched and merged to the current branch
     * @param privateKey generated by us and specific to the defaultApplication
     * @param publicKey generated by us and specific to the defaultApplication
     * @return success message
     */
    Mono<MergeStatusDTO> pullApplication(
            Path repoSuffix, String remoteUrl, String branchName, String privateKey, String publicKey)
            throws IOException;

    /**
     * @param repoSuffix suffixedPath used to generate the base repo path this includes orgId, defaultAppId, repoName
     * @return List of branches for the application
     */
    Mono<List<GitBranchDTO>> listBranches(
            Path repoSuffix, String remoteUrl, String privateKey, String publicKey, Boolean isDefaultBranchNeeded);

    /**
     * This method will handle the git-status functionality
     *
     * @param repoPath Path to actual repo
     * @param branchName branch name for which the status is required
     * @return Map of file names those are added, removed, modified
     */
    Mono<GitStatusDTO> getStatus(Path repoPath, String branchName);

    /**
     * @param repoSuffix suffixedPath used to generate the base repo path this includes orgId, defaultAppId, repoName
     * @param sourceBranch name of the branch whose commits will be referred amd merged to destinationBranch
     * @param destinationBranch Merge operation is performed on this branch
     * @return Merge status
     */
    Mono<String> mergeBranch(Path repoSuffix, String sourceBranch, String destinationBranch);

    /**
     * @param repoSuffix suffixedPath used to generate the base repo path this includes orgId, defaultAppId, repoName
     * @param publicKey public ssh key
     * @param privateKey private ssh key
     * @param isRepoPath does the repoSuffix contains the complete repoPath or only the suffix
     * @return messages received after the remote is fetched
     */
    Mono<String> fetchRemote(
            Path repoSuffix,
            String publicKey,
            String privateKey,
            boolean isRepoPath,
            String branchName,
            boolean isFetchAll);

    /**
     *
     * @param repoSuffix suffixedPath used to generate the base repo path this includes orgId, defaultAppId, repoName
     * @param sourceBranch name of the branch whose commits will be referred amd merged to destinationBranch
     * @param destinationBranch Merge operation is performed on this branch
     * @return Whether the two branches can be merged or not with list of files where the conflicts are present
     */
    Mono<MergeStatusDTO> isMergeBranch(Path repoSuffix, String sourceBranch, String destinationBranch);

    /**
     * This method will reset the repo to last commit for the specific branch
     *
     * @param repoSuffix suffixedPath used to generate the base repo path this includes orgId, defaultAppId, repoName
     * @param branchName branch for which the repo should hard reset
     * @return success status
     * @throws GitAPIException
     * @throws IOException
     */
    Mono<Boolean> resetToLastCommit(Path repoSuffix, String branchName) throws GitAPIException, IOException;

    /**
     *
     * @param repoSuffix suffixedPath used to generate the base repo path this includes orgId, defaultAppId, repoName
     * @param branchName Name of the remote branch
     * @return created branch name
     */
    Mono<String> checkoutRemoteBranch(Path repoSuffix, String branchName);

    /**
     *
     * @param publicKey public key
     * @param privateKey private key
     * @param remoteUrl remote repo ssh url
     * @return boolean if the connection can be established with the given keys
     */
    Mono<Boolean> testConnection(String publicKey, String privateKey, String remoteUrl);

    Mono<Boolean> resetHard(Path repoSuffix, String branchName);

    Mono<Boolean> rebaseBranch(Path repoSuffix, String branchName);

    Path createRepoPath(Path suffix);

    Mono<BranchTrackingStatus> getBranchTrackingStatus(Path repoPath, String branchName);
}
